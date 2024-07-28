<template>
  <div v-if="isLoading">Loading...</div>
  <div
    v-else
    class="timeline-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="timeline-head">
      <TimelineBreadcrumb
        :items="breadcrumbItems"
        :historyLength="history.length"
        @navigate="navigateTo"
        @back="goBack"
      />
    </div>
    <div class="timeline-content" ref="timelineRef">
      <div class="periods-container">
        <!-- Flag de début -->
        <TimelineFlag
          v-if="showFlags && startFlag.label"
          :label="startFlag.label"
          :eventTitle="startFlag.eventTitle"
          :isStart="true"
        />

        <TimelinePeriods
          :periods="scaledPeriods"
          @load-child="loadChildPeriod"
        />

        <!-- Flag de fin -->
        <TimelineFlag
          v-if="showFlags && endFlag.label"
          :label="endFlag.label"
          :eventTitle="endFlag.eventTitle"
          :isStart="false"
        />
      </div>

      <div class="timeline-line"></div>

      <div
        class="events-container"
        v-if="startDate !== null && endDate !== null"
        @mouseenter="handleEventsMouseEnter"
        @mouseleave="handleEventsMouseLeave"
        @mousemove="handleEventsMouseMove"
        ref="eventsContainerRef"
      >
        <TimelineCursor
          v-if="isCursorVisible && showCursor && !isHoveringEvent"
          :startDate="startDate"
          :endDate="endDate"
          :timelineWidth="timelineWidth"
          :mouseX="relativeMouseX"
          :mouseY="relativeMouseY"
          :isHoveringEvents="isHoveringEvents"
          :showCursor="showCursor"
          :containerHeight="timelineHeight"
        />
        <TimelineEvents
          @cursor-disable="isCursorVisible = false"
          @cursor-enable="isCursorVisible = true"
          :events="filteredEvents"
          :startDate="startDate"
          :endDate="endDate"
          :currentDepth="currentDepth"
          :maxDepth="maxDepth"
          :activeEventId="activeEventId"
          :highlightedEventIds="highlightedEventIds"
          @event-toggle="handleEventToggle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { nextTick } from "vue";
import { useTimelineCalculations } from "@/composables/useTimelineCalculations";
import { useTimelineInteractions } from "@/composables/useTimelineInteractions";
import { useTimelineDimensions } from "@/hooks/useTimelineDimensions";
import TimelinePeriods from "./TimelinePeriods.vue";
import TimelineEvents from "./TimelineEvents.vue";
import TimelineCursor from "./TimelineCursor.vue";
import TimelineBreadcrumb from "./TimelineBreadcrumb.vue";
import TimelineFlag from "./TimelineFlag.vue";
import dataService from "@/services/dataService";

export default {
  name: "Timeline",
  components: {
    TimelinePeriods,
    TimelineEvents,
    TimelineCursor,
    TimelineBreadcrumb,
    TimelineFlag,
  },
  setup() {
    const {
      allPeriods,
      events,
      startDate,
      endDate,
      history,
      currentDepth,
      maxDepth,
      breadcrumbItems,
      activeEventId,
      highlightedEventIds,
      scaledPeriods,
      filteredEvents,
      loadPeriod,
      loadChildPeriod,
      goBack,
      navigateTo,
      handleEventToggle,
      updateHighlightedEvents,
      currentPeriodId,
      currentPeriods,
      startFlag,
      endFlag,
    } = useTimelineCalculations();

    const showFlags = ref(false);
    const timelineRef = ref(null);
    const eventsContainerRef = ref(null);
    const relativeMouseX = ref(0);
    const relativeMouseY = ref(0);

    const {
      isHoveringEvents,
      showCursor,
      handleMouseMove,
      handleMouseLeave,
      handleEventsMouseEnter,
      handleEventsMouseLeave,
    } = useTimelineInteractions(timelineRef);

    const { timelineWidth, timelineHeight, updateTimelineDimensions } =
      useTimelineDimensions(timelineRef);

    //const isLoading = ref(INITIAL_LOADING_STATE);
    const isLoading = ref(true);

    const handleEventsMouseMove = (event) => {
      if (eventsContainerRef.value) {
        const rect = eventsContainerRef.value.getBoundingClientRect();
        relativeMouseX.value = event.clientX - rect.left;
        relativeMouseY.value = event.clientY - rect.top;
      }
    };

    const isCursorVisible = ref(true);
    const isHoveringEvent = ref(false);

    const handleCursorDisable = () => {
      isHoveringEvent.value = true;
    };

    const handleCursorEnable = () => {
      isHoveringEvent.value = false;
    };

    async function initializeData() {
      try {
        isLoading.value = true;
        allPeriods.value = await dataService.getPeriods();
        events.value = await dataService.getEvents();
        const rootPeriod = allPeriods.value.find((p) => p.id === 1);
        if (rootPeriod) {
          loadPeriod(rootPeriod);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(() => {
      initializeData().then(() => {
        nextTick(() => {
          updateTimelineDimensions();
        });
      });
    });

    onUnmounted(() => {
      // Clean up if necessary
    });

    watch(timelineRef, (newRef) => {
      if (newRef) {
        nextTick(() => {
          updateTimelineDimensions();
        });
      }
    });

    return {
      // État et références de la timeline
      isLoading,
      timelineRef,
      eventsContainerRef,
      timelineWidth,
      timelineHeight,

      // Données de la timeline
      scaledPeriods,
      filteredEvents,
      startDate,
      endDate,
      history,
      currentDepth,
      maxDepth,
      breadcrumbItems,

      // Gestion des événements
      activeEventId,
      highlightedEventIds,

      // Méthodes de navigation et d'interaction
      loadChildPeriod,
      goBack,
      navigateTo,
      handleEventToggle,

      // Gestion du curseur et des interactions souris
      isHoveringEvents,
      showCursor,
      isCursorVisible,
      isHoveringEvent,
      relativeMouseX,
      relativeMouseY,

      // Gestionnaires d'événements
      handleMouseLeave,
      handleEventsMouseMove,
      handleEventsMouseEnter,
      handleEventsMouseLeave,
      handleCursorDisable,
      handleCursorEnable,
      startFlag,
      endFlag,
      showFlags,
    };
  },
};
</script>

<style scoped lang="scss">
.timeline-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: $white-unlock;
  border: solid 1px rgb(230, 230, 230);
  border-radius: 8px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.timeline-head {
  position: relative;
  padding: 16px 16px 0;
  flex-shrink: 0;
  z-index: 10;
}

.timeline-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: black;
  transform: translateY(-50%);
  z-index: 1;
}

.events-container {
  flex: 1;
  position: relative;
}

.timeline-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: $white-unlock;
  border: solid 1px rgb(230, 230, 230);
  border-radius: 8px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.timeline-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.periods-container {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  position: relative;
}
</style>
