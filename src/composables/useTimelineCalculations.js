import { ref, computed } from "vue";
import dataService from "@/services/dataService";
import { parseDate, formatTimelineDate } from "@/utils/dateUtils";
import { calculateScaledWidths, isRelatedEvent } from "@/utils/timelineUtils";
import {
  ROOT_PERIOD_ID,
  NEGATIVE_INFINITY_DATE,
  INFINITY_DATE,
  EVENT_WEIGHT_BASE,
  MAX_DEPTH,
} from "@/constants/timelineConstants";

export function useTimelineCalculations() {
  const allPeriods = ref([]);
  const currentPeriods = ref([]);
  const events = ref([]);
  const startDate = ref(NEGATIVE_INFINITY_DATE);
  const endDate = ref(INFINITY_DATE);
  const history = ref([]);
  const currentPeriodId = ref(ROOT_PERIOD_ID);
  const currentDepth = ref(0);
  const maxDepth = ref(MAX_DEPTH);
  const breadcrumbItems = ref([]);
  const activeEventId = ref(null);
  const highlightedEventIds = ref(new Set());

  const rootBranches = ref([]);
  const currentBranchId = ref("overview");
  const branches = ref([]);

  const currentFilteredEvents = ref([]);
  const currentFilteredPeriods = ref([]);

  const scaledPeriods = computed(() => {
    const scaled = calculateScaledWidths(
      currentPeriods.value,
      startDate.value,
      endDate.value
    );
    return scaled;
  });

  const filteredEvents = computed(() => {
    const filtered = events.value.filter((event) => {
      const isDisplayable = shouldDisplayEvent(event);
      const isInBranch = !currentBranch.value || isEventInCurrentBranch(event);
      return isDisplayable && isInBranch;
    });
    return filtered;
  });

  const currentBranch = computed(() =>
    branches.value.find((branch) => branch.id === currentBranchId.value)
  );

  const startFlag = computed(() => {
    if (currentPeriods.value.length === 0 || events.value.length === 0) {
      return { label: "", eventTitle: null };
    }
    const currentPeriod = allPeriods.value.find(
      (p) => p.id === currentPeriodId.value
    );
    if (!currentPeriod) {
      return { label: "", eventTitle: null };
    }
    const firstEvent = events.value.find(
      (e) => parseDate(e.date) === parseDate(currentPeriod.startDate)
    );

    return {
      date: currentPeriod.startDate,
      label: formatTimelineDate(parseDate(currentPeriod.startDate)),
      eventTitle: firstEvent ? firstEvent.title : null,
    };
  });

  const endFlag = computed(() => {
    if (currentPeriods.value.length === 0 || events.value.length === 0) {
      return { label: "", eventTitle: null };
    }
    const currentPeriod = allPeriods.value.find(
      (p) => p.id === currentPeriodId.value
    );
    if (!currentPeriod) {
      return { label: "", eventTitle: null };
    }
    const lastEvent = events.value.find(
      (e) => parseDate(e.date) === parseDate(currentPeriod.endDate)
    );

    return {
      date: currentPeriod.endDate,
      label: formatTimelineDate(parseDate(currentPeriod.endDate)),
      eventTitle: lastEvent ? lastEvent.title : null,
    };
  });

  const availableBranches = ref([]);

  const updateAvailableBranches = () => {
    let availableBranchIds = new Set();

    if (currentBranchId.value === "overview") {
      // Pour la vue d'ensemble, on montre toutes les branches racines
      availableBranchIds = new Set(rootBranches.value.map((b) => b.id));
    } else {
      // Récupérer la branche active
      const activeBranch = branches.value.find(
        (b) => b.id === currentBranchId.value
      );

      if (activeBranch) {
        // Ajouter les branches connectées
        activeBranch.connections.forEach((conn) =>
          availableBranchIds.add(conn.branchId)
        );

        // Ajouter les sous-branches
        if (activeBranch.subBranches) {
          activeBranch.subBranches.forEach((subBranchId) =>
            availableBranchIds.add(subBranchId)
          );
        }
      }
    }

    // Filtrer les événements visibles sur la frise
    const visibleEvents = events.value.filter((event) => {
      const eventDate = parseDate(event.date);
      return (
        eventDate >= startDate.value &&
        eventDate <= endDate.value &&
        event.weight >= maxDepth.value - currentDepth.value
      );
    });

    // Ajouter les branches des événements visibles
    visibleEvents.forEach((event) => {
      if (event.branches) {
        event.branches.forEach((branchId) => availableBranchIds.add(branchId));
      }
    });

    // Mettre à jour les branches disponibles
    availableBranches.value = [
      { id: "overview", name: "Vue d'ensemble" },
      ...branches.value.filter((branch) => availableBranchIds.has(branch.id)),
    ];
  };

  function identifyRootBranches() {
    const subBranchIds = new Set(
      branches.value.flatMap((b) => b.subBranches || [])
    );
    rootBranches.value = branches.value.filter((b) => !subBranchIds.has(b.id));
  }

  function loadPeriod(period) {
    if (!period) return;
    const plainPeriod = JSON.parse(JSON.stringify(period));

    currentPeriodId.value = plainPeriod.id;
    startDate.value = parseDate(plainPeriod.startDate);
    endDate.value = parseDate(plainPeriod.endDate);

    const existingIndex = history.value.indexOf(plainPeriod.id);
    if (existingIndex !== -1) {
      history.value = history.value.slice(0, existingIndex + 1);
    } else {
      history.value.push(plainPeriod.id);
    }

    currentDepth.value = history.value.length - 1;
    maxDepth.value = calculateMaxDepth(plainPeriod);
    currentPeriods.value = getChildPeriods(plainPeriod);
    updateBreadcrumb();
    updateFilteredPeriods();
    updateFilteredEvents();
    updateAvailableBranches();

    // Conserver la branche sélectionnée
    if (currentBranchId.value !== "overview") {
      const selectedBranch = branches.value.find(
        (b) => b.id === currentBranchId.value
      );
      if (selectedBranch) {
        availableBranches.value = [
          { id: "overview", name: "Vue d'ensemble" },
          selectedBranch,
          ...availableBranches.value.filter(
            (b) => b.id !== "overview" && b.id !== currentBranchId.value
          ),
        ];
      }
    }
  }

  const updateFilteredPeriods = () => {
    if (currentBranchId.value === "overview") {
      currentFilteredPeriods.value = currentPeriods.value;
    } else {
      currentFilteredPeriods.value = currentPeriods.value.filter(
        (period) =>
          period.branches &&
          period.branches.includes(parseInt(currentBranchId.value))
      );
    }
  };

  function updateDateRange() {
    if (currentPeriods.value.length > 0) {
      startDate.value = Math.min(
        ...currentPeriods.value.map((p) => parseDate(p.startDate))
      );
      endDate.value = Math.max(
        ...currentPeriods.value.map((p) => parseDate(p.endDate))
      );
    }
  }

  function getChildPeriods(parentPeriod) {
    if (!parentPeriod || !parentPeriod.childs) return [];

    return parentPeriod.childs
      .map((childId) => {
        const child = allPeriods.value.find((p) => p.id === childId);
        if (!child) return null;
        return {
          ...child,
          width: "0%",
          position: "0%",
        };
      })
      .filter(Boolean); // Filtrer les valeurs null
  }

  function calculateMaxDepth(period) {
    if (!period.childs || period.childs.length === 0) return 0;
    const childDepths = period.childs.map((childId) => {
      const childPeriod = allPeriods.value.find((p) => p.id === childId);
      return childPeriod ? calculateMaxDepth(childPeriod) : 0;
    });
    return 1 + Math.max(...childDepths);
  }

  function updateBreadcrumb() {
    breadcrumbItems.value = history.value.map((id) => {
      const period = allPeriods.value.find((p) => p.id === id);
      return period ? period.title : "";
    });
  }

  function loadChildPeriod(childId) {
    const childPeriod = allPeriods.value.find((p) => p.id === childId);
    if (childPeriod) {
      loadPeriod(childPeriod);
    } else {
      console.error(`Child period with id ${childId} not found`);
    }
  }

  function goBack() {
    if (history.value.length > 1) {
      history.value.pop();
      const previousPeriodId = history.value[history.value.length - 1];
      const previousPeriod = allPeriods.value.find(
        (p) => p.id === previousPeriodId
      );
      loadPeriod(previousPeriod);
    }
  }

  function navigateTo(index) {
    if (index >= 0 && index < history.value.length) {
      const targetPeriodId = history.value[index];
      const targetPeriod = allPeriods.value.find(
        (p) => p.id === targetPeriodId
      );
      history.value = history.value.slice(0, index + 1);
      loadPeriod(targetPeriod);
    }
  }

  function handleEventToggle(eventId) {
    activeEventId.value = activeEventId.value === eventId ? null : eventId;
    updateHighlightedEvents(activeEventId.value);
  }

  function updateHighlightedEvents(activeEventId) {
    highlightedEventIds.value.clear();
    if (activeEventId === null) return;

    const activeEvent = events.value.find((e) => e.id === activeEventId);
    if (!activeEvent) return;

    events.value.forEach((event) => {
      if (event.id !== activeEventId && isRelatedEvent(activeEvent, event)) {
        highlightedEventIds.value.add(event.id);
      }
    });
  }

  function shouldDisplayEvent(event) {
    const eventDate = parseDate(event.date);
    const isInDateRange =
      eventDate >= startDate.value && eventDate <= endDate.value;

    return isInDateRange;
  }

  // Après l'appel à shouldDisplayEvent
  const displayableEvents = events.value.filter(shouldDisplayEvent);

  const isEventInCurrentBranch = (event) => {
    if (currentBranchId.value === "overview") {
      return rootBranches.value.some(
        (rb) => event.branches && event.branches.includes(rb.id)
      );
    }
    
    const currentBranchIdNum = parseInt(currentBranchId.value);
    
    return (
      (event.branches && event.branches.includes(currentBranchIdNum)) ||
      (currentBranch.value &&
        currentBranch.value.tags &&
        event.tags &&
        currentBranch.value.tags.some((tag) => event.tags.includes(tag)))
    );
  };

  async function loadBranches() {
    branches.value = await dataService.getBranches();
    identifyRootBranches();
    allPeriods.value = await dataService.getPeriods();
    updateFilteredPeriods();
    updateAvailableBranches();
  }

  const findMacroPeriods = (branchId) => {
    return allPeriods.value.filter(
      (period) =>
        period.branches &&
        period.branches.includes(branchId) &&
        (!period.parentId || period.parentId === ROOT_PERIOD_ID)
    );
  };

  const setCurrentBranch = (branchId) => {
    currentBranchId.value = branchId;

    if (branchId === "overview") {
      const rootPeriod = allPeriods.value.find((p) => p.id === ROOT_PERIOD_ID);
      if (rootPeriod) {
        loadPeriod(rootPeriod);
      }
    } else {
      const macroPeriods = findMacroPeriods(branchId);
      if (macroPeriods.length > 0) {
        currentPeriods.value = macroPeriods;
        startDate.value = Math.min(
          ...macroPeriods.map((p) => parseDate(p.startDate))
        );
        endDate.value = Math.max(
          ...macroPeriods.map((p) => parseDate(p.endDate))
        );
        currentPeriodId.value = ROOT_PERIOD_ID;
        history.value = [ROOT_PERIOD_ID];
        currentDepth.value = 0;
        updateBreadcrumb();
      } else {
        // console.log("Aucune période macro trouvée pour la branche:", branchId);
      }
    }

    updateFilteredPeriods();
    updateFilteredEvents();
    updateAvailableBranches();

    // Mise à jour du sélecteur
    const selectedBranch = branches.value.find((b) => b.id === branchId);
    if (selectedBranch) {
      availableBranches.value = [
        { id: "overview", name: "Vue d'ensemble" },
        selectedBranch,
        ...availableBranches.value.filter(
          (b) => b.id !== "overview" && b.id !== branchId
        ),
      ];
    }
  };

  const resetFilters = () => {
    currentFilteredPeriods.value = allPeriods.value.filter((period) =>
      rootBranches.value.some(
        (rb) => period.branches && period.branches.includes(rb.id)
      )
    );
    updateDateRange();
    activeEventId.value = null;
    highlightedEventIds.value = new Set();
  };

  const filterByBranch = (branchId) => {
    const branch = branches.value.find((b) => b.id === branchId);
    if (!branch) {
      currentFilteredPeriods.value = [];
      return;
    }

    currentFilteredPeriods.value = allPeriods.value.filter(
      (period) =>
        (period.branches && period.branches.includes(branch.id)) ||
        (branch.tags &&
          period.tags &&
          branch.tags.some((tag) => period.tags.includes(tag)))
    );
    updateDateRange();
    if (branch.highlightEvent) {
      activeEventId.value = branch.highlightEvent;
      highlightedEventIds.value = new Set([branch.highlightEvent]);
    }
  };

  const activateHighlightEvent = (branchId) => {
    const branch = branches.value.find((b) => b.id === branchId);
    if (branch && branch.highlightEvent) {
      activeEventId.value = branch.highlightEvent;
      highlightedEventIds.value = new Set([branch.highlightEvent]);
    } else {
      activeEventId.value = null;
      highlightedEventIds.value = new Set();
    }
  };

  const updateFilteredEvents = () => {
    const allEventsForGeology = events.value.filter(
      (event) =>
        event.branches &&
        (event.branches.includes(15) || event.branches.includes("15"))
    );

    currentFilteredEvents.value = events.value.filter((event) => {
       const isInCurrentPeriod =
         parseDate(event.date) >= startDate.value &&
         parseDate(event.date) <= endDate.value;

      let isInBranch;
      if (currentBranchId.value === "overview") {
        isInBranch = true;
      } else {
        const currentBranchIdNum = parseInt(currentBranchId.value);
        isInBranch =
          event.branches &&
          (event.branches.includes(currentBranchId.value) ||
            event.branches.includes(currentBranchIdNum) ||
            event.branches.includes(currentBranchId.value.toString()));
      }
      // return isInCurrentPeriod && isInBranch;
      return isInBranch; // On ne filtre que par branche
    });

    const filteredEventsForGeology = currentFilteredEvents.value.filter(
      (event) =>
        event.branches &&
        (event.branches.includes(15) || event.branches.includes("15"))
    );

  };

  function findPeriodForEvent(event) {
    return allPeriods.value.find(
      (period) =>
        parseDate(event.date) >= parseDate(period.startDate) &&
        parseDate(event.date) <= parseDate(period.endDate)
    );
  }

  return {
    // Données temporelles
    allPeriods,
    currentPeriods,
    events,
    startDate,
    endDate,
    history,

    // Informations sur la période courante
    currentPeriodId,
    currentDepth,
    maxDepth,

    // Navigation et interface utilisateur
    breadcrumbItems,
    activeEventId,
    highlightedEventIds,

    // Gestion des branches
    currentBranchId,
    branches,
    currentBranch,
    availableBranches,
    rootBranches,

    // Données calculées ou filtrées
    scaledPeriods,
    filteredEvents,

    // Indicateurs
    startFlag,
    endFlag,

    // Fonctions de chargement et de navigation
    loadPeriod,
    loadChildPeriod,
    goBack,
    navigateTo,
    handleEventToggle,

    // Fonctions de gestion des branches
    setCurrentBranch,
    loadBranches,
    availableBranches,
    currentBranchId,

    currentFilteredEvents,
    currentFilteredPeriods,
    updateFilteredEvents,
    updateFilteredPeriods,
  };
}