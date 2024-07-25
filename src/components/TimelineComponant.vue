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
    <div class="timeline-content" ref="timeline">
      <div class="periods-container">
        <TimelinePeriods
          :periods="scaledPeriods"
          @load-child="loadChildPeriod"
        />
      </div>

      <div class="timeline-line"></div>

      <div
        class="events-container"
        v-if="startDate !== null && endDate !== null"
      >
        <TimelineEvents
          :events="filteredEvents"
          :startDate="startDate"
          :endDate="endDate"
          :currentDepth="currentDepth"
          :maxDepth="maxDepth"
          :activeEventId="activeEventId"
          :highlightedEventIds="highlightedEventIds"
          @event-toggle="handleEventToggle"
          @events-mouseenter="handleEventsMouseEnter"
          @events-mouseleave="handleEventsMouseLeave"
        />
      </div>
      <TimelineCursor
        v-if="showCursor"
        :startDate="startDate"
        :endDate="endDate"
        :timelineWidth="timelineWidth"
        :mouseX="mouseX"
        :mouseY="mouseY"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useTimelineCalculations } from "@/composables/useTimelineCalculations";
import TimelinePeriods from "./TimelinePeriods.vue";
import TimelineEvents from "./TimelineEvents.vue";
import TimelineCursor from "./TimelineCursor.vue";
import TimelineBreadcrumb from "./TimelineBreadcrumb.vue";
import dataService from "@/services/dataService";

export default {
  name: "Timeline",
  components: {
    TimelinePeriods,
    TimelineEvents,
    TimelineCursor,
    TimelineBreadcrumb,
  },
  setup() {
    console.log("Timeline setup started");
    const {
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
      loadChildPeriod,
      goBack,
      navigateTo,
      handleEventToggle,
      updateHighlightedEvents,
    } = useTimelineCalculations();

    const isHoveringEvents = ref(false);
    const showCursor = ref(false);
    const mouseX = ref(0);
    const mouseY = ref(0);
    const timelineWidth = ref(0);
    const timelineRef = ref(null);
    const isLoading = ref(true);
    const timelineHeight = ref(0);

    function handleMouseMove(event) {
      if (timelineRef.value) {
        const rect = timelineRef.value.getBoundingClientRect();
        mouseX.value = event.clientX - rect.left;
        mouseY.value = event.clientY - rect.top;
        showCursor.value = true;
        console.log(
          "Mouse moved:",
          mouseX.value,
          mouseY.value,
          "Timeline width:",
          timelineWidth.value
        );
      }
    }
    function handleMouseLeave() {
      showCursor.value = false;
    }

    function handleEventsMouseEnter() {
      isHoveringEvents.value = true;
      showCursor.value = false;
    }

    function handleEventsMouseLeave() {
      isHoveringEvents.value = false;
      if (mouseX.value >= 0 && mouseX.value <= timelineWidth.value) {
        showCursor.value = true;
      }
    }

    function updateTimelineDimensions() {
      const checkInterval = setInterval(() => {
        if (timelineRef.value) {
          clearInterval(checkInterval);
          const newWidth = timelineRef.value.offsetWidth;
          const newHeight = timelineRef.value.offsetHeight;
          if (newWidth > 0 && newHeight > 0) {
            timelineWidth.value = newWidth;
            timelineHeight.value = newHeight;
            console.log(
              "Timeline dimensions updated:",
              timelineWidth.value,
              timelineHeight.value
            );
          } else {
            console.error("Invalid timeline dimensions:", newWidth, newHeight);
          }
        }
      }, 100); // Vérifier toutes les 100ms

      // Arrêter l'intervalle après 5 secondes si la référence n'est toujours pas disponible
      setTimeout(() => clearInterval(checkInterval), 5000);
    }

    async function initializeData() {
      try {
        isLoading.value = true;
        allPeriods.value = await dataService.getPeriods();
        events.value = await dataService.getEvents();
        const rootPeriod = allPeriods.value.find((p) => p.id === 1);
        if (rootPeriod) {
          loadPeriod(rootPeriod);
          startDate.value = rootPeriod.startDate;
          endDate.value = rootPeriod.endDate;
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        isLoading.value = false;
        nextTick(() => {
          updateTimelineDimensions();
        });
      }
    }

    onMounted(() => {
      console.log("Timeline mounted");
      initializeData()
        .then(() => {
          updateTimelineDimensions();
        })
        .catch((error) => {
          console.error("Error in initializeData:", error);
        });

      window.addEventListener("resize", updateTimelineDimensions);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateTimelineDimensions);
    });

    watch(
      [showCursor, isHoveringEvents, startDate, endDate],
      ([show, hover, start, end]) => {
        console.log("Cursor conditions changed:", { show, hover, start, end });
      }
    );
    watch(timelineRef, (newRef) => {
      if (newRef) {
        console.log("Timeline ref is now available");
        updateTimelineDimensions();
      }
    });

    return {
      scaledPeriods,
      filteredEvents,
      startDate,
      endDate,
      history,
      currentDepth,
      maxDepth,
      breadcrumbItems,
      activeEventId,
      highlightedEventIds,
      isHoveringEvents,
      showCursor,
      mouseX,
      mouseY,
      timelineWidth,
      timelineHeight,
      timelineRef,
      loadChildPeriod,
      goBack,
      navigateTo,
      handleEventToggle,
      handleMouseMove,
      handleMouseLeave,
      handleEventsMouseEnter,
      handleEventsMouseLeave,
      isLoading,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

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

.periods-container {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
}

.events-container {
  flex: 1;
  position: relative;
}
</style>
