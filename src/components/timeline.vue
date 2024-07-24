<template>
  <div v-if="isLoading">Loading...</div>
  <div
    v-else
    class="timeline-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- reste du contenu -->

    <div
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
      <div class="timeline" ref="timeline">
        <div class="periods">
          <TimelinePeriods
            :periods="scaledPeriods"
            @load-child="loadChildPeriod"
          />
        </div>
        <div class="events" v-if="startDate !== null && endDate !== null">
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
      </div>
      <TimelineCursor
        v-if="
          showCursor &&
          !isHoveringEvents &&
          startDate !== null &&
          endDate !== null
        "
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
import { ref, onMounted, onUnmounted } from "vue";
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

    function handleMouseMove(event) {
  if (timelineRef.value) {
    const rect = timelineRef.value.getBoundingClientRect();
    mouseX.value = event.clientX - rect.left;
    mouseY.value = event.clientY - rect.top;
    if (!isHoveringEvents.value) {
      showCursor.value = true;
    }
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

    function updateTimelineWidth() {
      if (timelineRef.value) {
        timelineWidth.value = timelineRef.value.offsetWidth;
      }
    }

    async function initializeData() {
      try {
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
      initializeData();
      updateTimelineWidth();
      window.addEventListener("resize", updateTimelineWidth);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateTimelineWidth);
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
      timelineRef,
      loadChildPeriod,
      goBack,
      navigateTo,
      handleEventToggle,
      handleMouseMove,
      handleMouseLeave,
      handleEventsMouseEnter,
      handleEventsMouseLeave,
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
}

.timeline {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: $neutral-highest;
  transform: translateY(-50%);
}

.periods {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  z-index: 1;
}

.timeline-head {
  display: flex;
  color: $neutral-highest;
  margin-top: 16px;
  margin-left: 16px;
}
</style>
