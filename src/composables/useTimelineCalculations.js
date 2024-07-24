import { ref, computed } from 'vue';
import { calculateScaledWidths, calculateWidth, calculatePosition, isRelatedEvent } from '@/utils/timelineUtils';
import { parseDate, formatDuration } from '@/utils/dateUtils';

export function useTimelineCalculations() {
  const allPeriods = ref([]);
  const currentPeriods = ref([]);
  const events = ref([]);
  const startDate = ref(null);
  const endDate = ref(null);
  const history = ref([]);
  const currentPeriodId = ref(null);
  const currentDepth = ref(0);
  const maxDepth = ref(0);
  const breadcrumbItems = ref([]);
  const activeEventId = ref(null);
  const highlightedEventIds = ref(new Set());

  const scaledPeriods = computed(() => 
    calculateScaledWidths(currentPeriods.value, startDate.value, endDate.value)
  );

  function loadPeriod(period) {
    currentPeriodId.value = period.id;
    startDate.value = period.startDate;
    endDate.value = period.endDate;
    const childPeriods = getChildPeriods(period);
    currentPeriods.value = childPeriods;
    maxDepth.value = calculateMaxDepth(period);
    updateBreadcrumb();
  }

  function getChildPeriods(parentPeriod) {
    return parentPeriod.childs.map(child => ({
      ...child,
      width: '0%',
      position: '0%'
    }));
  }

  function calculateMaxDepth(period) {
    let depth = 0;
    if (period.childs && period.childs.length > 0) {
      depth = 1 + Math.max(...period.childs.map(calculateMaxDepth));
    }
    return depth;
  }

  function updateBreadcrumb() {
    breadcrumbItems.value = history.value.map(id => {
      const period = allPeriods.value.find(p => p.id === id);
      return period ? period.title : '';
    });
    breadcrumbItems.value.push(allPeriods.value.find(p => p.id === currentPeriodId.value).title);
  }

  function loadChildPeriod(childId) {
    const childPeriod = currentPeriods.value.find(p => p.id === childId);
    if (childPeriod) {
      history.value.push(currentPeriodId.value);
      loadPeriod(childPeriod);
    }
  }

  function goBack() {
    if (history.value.length > 0) {
      const previousPeriodId = history.value.pop();
      const previousPeriod = allPeriods.value.find(p => p.id === previousPeriodId);
      loadPeriod(previousPeriod);
    }
  }

  function navigateTo(index) {
    if (index < history.value.length) {
      const targetPeriodId = history.value[index];
      const targetPeriod = allPeriods.value.find(p => p.id === targetPeriodId);
      history.value = history.value.slice(0, index);
      loadPeriod(targetPeriod);
    }
  }

  function handleEventToggle(eventId) {
    if (activeEventId.value === eventId) {
      activeEventId.value = null;
      highlightedEventIds.value.clear();
    } else {
      activeEventId.value = eventId;
      updateHighlightedEvents(eventId);
    }
  }

  function updateHighlightedEvents(activeEventId) {
    const activeEvent = events.value.find(e => e.id === activeEventId);
    if (!activeEvent) return;

    highlightedEventIds.value.clear();
    events.value.forEach(event => {
      if (event.id !== activeEventId && isRelatedEvent(activeEvent, event)) {
        highlightedEventIds.value.add(event.id);
      }
    });
  }

  function shouldDisplayEvent(event) {
    const BASE = 4;
    const depthRatio = currentDepth.value / maxDepth.value;
    const weightThreshold = (1 - Math.log(depthRatio + 1) / Math.log(BASE)) * maxDepth.value;
    return event.weight >= weightThreshold;
  }

  function updateFilteredEvents() {
    const start = startDate.value === -Infinity ? -Infinity : parseDate(startDate.value);
    const end = endDate.value === Infinity ? Infinity : parseDate(endDate.value);
    return events.value.filter(event => {
      const eventDate = parseDate(event.date);
      return eventDate >= start && eventDate <= end && shouldDisplayEvent(event);
    }).map(event => ({
      ...event,
      hover: false,
      active: activeEventId.value === event.id,
      highlight: highlightedEventIds.value.has(event.id)
    }));
  }

  const filteredEvents = computed(() => updateFilteredEvents());

  return {
    allPeriods,
    currentPeriods,
    events,
    startDate,
    endDate,
    history,
    currentPeriodId,
    currentDepth,
    maxDepth,
    breadcrumbItems,
    activeEventId,
    highlightedEventIds,
    scaledPeriods,
    filteredEvents,
    loadPeriod,
    getChildPeriods,
    calculateMaxDepth,
    updateBreadcrumb,
    loadChildPeriod,
    goBack,
    navigateTo,
    handleEventToggle,
    updateHighlightedEvents,
    shouldDisplayEvent
  };
}