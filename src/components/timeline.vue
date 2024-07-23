<template>
  <div
    class="timeline-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="timeline-head">
      <Breadcrumb
        :items="breadcrumbItems"
        :historyLength="history.length"
        @navigate="navigateTo"
        @back="goBack"
      />
    </div>
    <div class="timeline" ref="timeline">
      <div class="periods">
        <PeriodsComponent
          :periods="currentPeriods"
          @load-child="loadChildPeriod"
        />
      </div>
      <div class="events" v-if="startDate !== null && endDate !== null">
        <EventsComponent 
          :events="events"
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
</template>

<script>
import { inject } from 'vue';
import PeriodsComponent from './PeriodsComponent.vue';
import EventsComponent from './EventsComponent.vue';
import TimelineCursor from './TimelineCursor.vue';
import Breadcrumb from './breadcrumb.vue';

import dataService from '@/services/dataService.js';
import { parseDate, calculateDuration, formatDuration } from '@/services/dateUtils';

export default {
  name: 'Timeline',
  components: {
    PeriodsComponent,
    EventsComponent,
    Breadcrumb,
    TimelineCursor
  },

  computed: {
    effectiveStartDate() {
      return this.startDate ?? -Infinity;
    },
    effectiveEndDate() {
      return this.endDate ?? Infinity;
    }
  },


  data() {
    return {
      allPeriods: [],
      currentPeriods: [],
      currentPeriodId: null,
      events: [],
      history: [],
      breadcrumbItems: [],
      startDate: null,
      endDate: null,
      isHoveringEvents: false,
      showCursor: false,
      mouseX: 0,
      mouseY: 0,
      timelineWidth: 0,
      currentDepth: 0,
      maxDepth: 0,
      activeEventId: null,
      highlightedEventIds: new Set()
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.updateTimelineWidth();
      window.addEventListener('resize', this.updateTimelineWidth);
    });
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateTimelineWidth);
  },

  async created() {
  await this.initializeData();
  this.initializeTimeline();
},
  methods: {
    async initializeData() {
    this.allPeriods = await dataService.getPeriods();
    this.events = await dataService.getEvents();

    const rootPeriod = this.allPeriods.find(p => p.id === 1);
    if (rootPeriod) {
      this.startDate = rootPeriod.startDate;
      this.endDate = rootPeriod.endDate;
    }
  },

  initializeTimeline() {
    const rootPeriod = this.allPeriods.find(p => p.id === 1);
    if (rootPeriod) {
      this.loadPeriod(rootPeriod);
    }
  },

    loadPeriod(period) {
      this.currentPeriodId = period.id;
      this.startDate = period.startDate;
      this.endDate = period.endDate;
      const childPeriods = this.getChildPeriods(period);
      this.currentPeriods = this.calculateScaledWidths(
        childPeriods,
        period.startDate,
        period.endDate
      );
      this.updateBreadcrumb();
      this.maxDepth = this.calculateMaxDepth(period);
    },

    calculateMaxDepth(period) {
    let depth = 0;
    if (period.childs && period.childs.length > 0) {
      depth = 1 + Math.max(...period.childs.map(this.calculateMaxDepth));
    }
    return depth;
  },
    getChildPeriods(parentPeriod) {
      return parentPeriod.childs.map(child => ({
        ...child,
        width: '0%',
        position: '0%'
      }));
    },

    loadChildPeriod(childId) {
      const childPeriod = this.currentPeriods.find(p => p.id === childId);
      if (childPeriod) {
        this.history.push(this.currentPeriodId);
        this.loadPeriod(childPeriod);
      }
    },

    goBack() {
      if (this.history.length > 0) {
        const previousPeriodId = this.history.pop();
        const previousPeriod = this.allPeriods.find(p => p.id === previousPeriodId);
        this.loadPeriod(previousPeriod);
      }
    },

    navigateTo(index) {
      if (index < this.history.length) {
        const targetPeriodId = this.history[index];
        const targetPeriod = this.allPeriods.find(p => p.id === targetPeriodId);
        this.history = this.history.slice(0, index);
        this.loadPeriod(targetPeriod);
      }
    },

    updateBreadcrumb() {
      this.breadcrumbItems = this.history.map(id => {
        const period = this.allPeriods.find(p => p.id === id);
        return period ? period.title : '';
      });
      this.breadcrumbItems.push(this.allPeriods.find(p => p.id === this.currentPeriodId).title);
    },

    calculateScaledWidths(periods, parentStartDate, parentEndDate) {
      const today = new Date().getFullYear();
      const sortedPeriods = periods.sort((a, b) => a.startDate - b.startDate);
      let lastEndPosition = 0;

      return sortedPeriods.map(period => {
        const start = period.startDate === 'today' ? today : parseDate(period.startDate);
        const end = period.endDate === 'today' ? today : parseDate(period.endDate);

        let width = this.calculateWidth(start, end, parentStartDate, parentEndDate);
        let position = this.calculatePosition(start, parentStartDate, parentEndDate);

        position = Math.max(position, lastEndPosition);
        const availableWidth = 100 - position;
        width = Math.min(width, availableWidth);

        lastEndPosition = position + width;

        return {
          ...period,
          width: `${width}%`,
          position: `${position}%`
        };
      });
    },

    calculateWidth(startDate, endDate, parentStartDate, parentEndDate) {
      const start = parseDate(startDate);
      const end = parseDate(endDate);
      const parentStart = parseDate(parentStartDate);
      const parentEnd = parseDate(parentEndDate);

      const totalDuration = parentEnd - parentStart;
      const periodDuration = end - start;

      const width = (periodDuration / totalDuration) * 100;

      return Math.max(width, 0.5);
    },

    calculatePosition(date, parentStartDate, parentEndDate) {
      const normalizedDate = parseDate(date);
      const normalizedParentStart = parseDate(parentStartDate);
      const normalizedParentEnd = parseDate(parentEndDate);

      const totalDuration = normalizedParentEnd - normalizedParentStart;
      const position = ((normalizedDate - normalizedParentStart) / totalDuration) * 100;

      return Math.max(position, 0);
    },

    updateTimelineWidth() {
      if (this.$refs.timeline) {
        this.timelineWidth = this.$refs.timeline.offsetWidth;
      }
    },

    handleMouseMove(event) {
  const rect = this.$refs.timeline.getBoundingClientRect();
  this.mouseX = event.clientX - rect.left;
  this.mouseY = event.clientY - rect.top;

  // Afficher le curseur seulement si on ne survole pas un événement
  if (!this.isHoveringEvents) {
    this.showCursor = true;
  }
},
  handleMouseLeave() {
    this.showCursor = false;
  },
  handleEventsMouseEnter() {
    this.isHoveringEvents = true;
  },
  handleEventsMouseLeave() {
    this.isHoveringEvents = false;
    // Réactiver le curseur si la souris est toujours sur la timeline
    if (this.mouseX >= 0 && this.mouseX <= this.timelineWidth) {
      this.showCursor = true;
    }
  },

  handleEventToggle(eventId) {
    if (this.activeEventId === eventId) {
      this.activeEventId = null;
      this.highlightedEventIds.clear();
    } else {
      this.activeEventId = eventId;
      this.updateHighlightedEvents(eventId);
    }
  },

  updateHighlightedEvents(activeEventId) {
    const activeEvent = this.events.find(e => e.id === activeEventId);
    if (!activeEvent) return;

    this.highlightedEventIds.clear();
    this.events.forEach(event => {
      if (event.id !== activeEventId && this.isRelatedEvent(activeEvent, event)) {
        this.highlightedEventIds.add(event.id);
      }
    });
  },

  isRelatedEvent(activeEvent, otherEvent) {
    // Implémentation comme vue précédemment
    if (!activeEvent.branches || !otherEvent.branches) {
      return false;
    }
    const activeBranches = new Set(activeEvent.branches);
    const otherBranches = new Set(otherEvent.branches);
    for (let branch of activeBranches) {
      if (otherBranches.has(branch)) {
        return true;
      }
    }
    return false;
  },

},
}
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
