// src/composables/useTimelineCalculations.js

import { ref, computed } from 'vue';
import { calculateScaledWidths, isRelatedEvent } from '@/utils/timelineUtils';
import { parseDate, formatTimelineDate } from '@/utils/dateUtils';
import {
  ROOT_PERIOD_ID,
  NEGATIVE_INFINITY_DATE,
  INFINITY_DATE,
  EVENT_WEIGHT_BASE,
  MAX_DEPTH
} from '@/constants/timelineConstants';


export function useTimelineCalculations() {
  // État
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

  // Calculs dérivés
  const scaledPeriods = computed(() => 
    calculateScaledWidths(currentPeriods.value, startDate.value, endDate.value)
  );

  const filteredEvents = computed(() => updateFilteredEvents());

  // Fonctions
  function loadPeriod(period) {
    currentPeriodId.value = period.id;
    startDate.value = period.startDate;
    endDate.value = period.endDate;
    currentPeriods.value = getChildPeriods(period);
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
    if (!period.childs || period.childs.length === 0) return 0;
    return 1 + Math.max(...period.childs.map(calculateMaxDepth));
  }

  function updateBreadcrumb() {
    breadcrumbItems.value = [
      ...history.value.map(id => {
        const period = allPeriods.value.find(p => p.id === id);
        return period ? period.title : '';
      }),
      allPeriods.value.find(p => p.id === currentPeriodId.value).title
    ];
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
    activeEventId.value = activeEventId.value === eventId ? null : eventId;
    updateHighlightedEvents(activeEventId.value);
  }

  function updateHighlightedEvents(activeEventId) {
    highlightedEventIds.value.clear();
    if (activeEventId === null) return;

    const activeEvent = events.value.find(e => e.id === activeEventId);
    if (!activeEvent) return;

    events.value.forEach(event => {
      if (event.id !== activeEventId && isRelatedEvent(activeEvent, event)) {
        highlightedEventIds.value.add(event.id);
      }
    });
  }

  function shouldDisplayEvent(event) {
    const depthRatio = currentDepth.value / maxDepth.value;
    const weightThreshold = (1 - Math.log(depthRatio + 1) / Math.log(EVENT_WEIGHT_BASE)) * maxDepth.value;
    return event.weight >= weightThreshold;
  }

  function updateFilteredEvents() {
    const start = startDate.value === NEGATIVE_INFINITY_DATE ? NEGATIVE_INFINITY_DATE : parseDate(startDate.value);
    const end = endDate.value === INFINITY_DATE ? INFINITY_DATE : parseDate(endDate.value);
    return events.value
      .filter(event => {
        const eventDate = parseDate(event.date);
        return eventDate >= start && eventDate <= end && shouldDisplayEvent(event);
      })
      .map(event => ({
        ...event,
        hover: false,
        active: activeEventId.value === event.id,
        highlight: highlightedEventIds.value.has(event.id)
      }));
  }

  return {
    // État
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
    // Calculs dérivés
    scaledPeriods,
    filteredEvents,
    // Fonctions
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