<template>
  <div class="events-container">
    <div v-for="event in processedEvents" :key="event.id" 
    class="timeline-event" 
    :style="{ left: `calc(${calculatePosition(event.date)} - 5px)` }"
    @mouseover="handleMouseOver(event)"
    @mouseleave="handleMouseLeave(event)"
    @click="toggleActive(event)">
  <div class="circle" :class="{ 
    'active-circle': event.active, 
    'highlight-circle': event.highlight 
  }"></div>

  <tooltip
    :visible="event.hover && !event.active"
    :title="event.title"
    :formattedYear="formatDate(event.date)"
    placement="bottom"
  ></tooltip>

  <div class="content" :class="{ active: event.active }">
    <p class="textRegular textBlack spacing_xs">{{ event.title }}</p>
    <p class="textLight textDimmed">{{ formatDate(event.date) }}</p>
  </div>
</div>
  </div>
</template>

<script>
import tooltip from './Tooltip.vue';
import { parseDate, formatDuration } from '@/utils/dateUtils';
import { calculateEventPosition, shouldDisplayEvent } from '@/utils/timelineUtils';

export default {
  name: 'EventsComponent',
  components: {
    tooltip
  },
  props: {
  events: {
    type: Array,
    default: () => []
  },
  startDate: {
    type: [Number, String],
    required: true
  },
  endDate: {
    type: [Number, String],
    required: true
  },
  currentDepth: {
    type: Number,
    required: true
  },
  maxDepth: {
    type: Number,
    required: true
  },
  activeEventId: {
    type: Number,
    default: null
  },
  highlightedEventIds: {
    type: Set,
    default: () => new Set()
  }
},
computed: {
  processedEvents() {
    return this.filteredEvents.map(event => ({
      ...event,
      active: event.id === this.activeEventId,
      highlight: this.highlightedEventIds.has(event.id),
      hover: event.hover // Assurez-vous que l'état hover est préservé
    }));
  }
},
  emits: ['event-mouseenter', 'event-mouseleave', 'events-mouseenter', 'events-mouseleave'],

  data() {
    return {
      filteredEvents: []
    }
  },

  methods: {
    handleMouseOver(event) {
      this.showTooltip(event);
      this.$emit('event-mouseenter');
    },

    handleMouseLeave(event) {
      this.hideTooltip();
      this.$emit('event-mouseleave');
    },

    showTooltip(event) {
    this.filteredEvents = this.filteredEvents.map(e => 
      e.id === event.id ? { ...e, hover: true } : { ...e, hover: false }
    );
  },

  hideTooltip() {
    this.filteredEvents = this.filteredEvents.map(e => ({ ...e, hover: false }));
  },

    toggleActive(event) {
    this.$emit('event-toggle', event.id);
  },
      isRelatedEvent(activeEvent, otherEvent) {
        // Vérifier si les deux événements ont des branches
        if (!activeEvent.branches || !otherEvent.branches) {
          return false;
        }

        // Convertir les branches en ensembles pour une comparaison plus efficace
        const activeBranches = new Set(activeEvent.branches);
        const otherBranches = new Set(otherEvent.branches);

        // Vérifier s'il y a une intersection entre les ensembles de branches
        for (let branch of activeBranches) {
          if (otherBranches.has(branch)) {
            return true;
          }
        }

        return false;
      },

    calculatePosition(date) {
      const eventDate = parseDate(date);
      const start = this.startDate === -Infinity ? parseDate(this.events[0].date) : parseDate(this.startDate);
      const end = this.endDate === Infinity ? parseDate(this.events[this.events.length - 1].date) : parseDate(this.endDate);
      const totalDuration = end - start;
      const position = ((eventDate - start) / totalDuration) * 100;
      return `${position}%`;
    },
    formatDate(date) {
      const eventDate = parseDate(date);
      if (typeof eventDate === 'number') {
        return formatDuration(Math.abs(eventDate));
      }
      return new Date(eventDate).toLocaleDateString();
    },

    shouldDisplayEvent(event) {
    // Constante pour ajuster la "raideur" de la courbe logarithmique
    const BASE = 4;

    // Calculer le seuil de poids minimum requis pour cet niveau de profondeur
    const depthRatio = this.currentDepth / this.maxDepth;
    const weightThreshold = (1 - Math.log(depthRatio + 1) / Math.log(BASE)) * this.maxDepth;

    // Un événement est affiché si son poids est supérieur ou égal au seuil calculé
    return event.weight >= weightThreshold;
    },

    updateFilteredEvents() {
  const start = this.startDate === -Infinity ? -Infinity : parseDate(this.startDate);
  const end = this.endDate === Infinity ? Infinity : parseDate(this.endDate);
  this.filteredEvents = this.events.filter(event => {
    const eventDate = parseDate(event.date);
    return eventDate >= start && eventDate <= end && this.shouldDisplayEvent(event);
  }).map(event => ({
    ...event,
    hover: false, // Initialisez hover à false
    active: this.activeEventId === event.id,
    highlight: this.highlightedEventIds.has(event.id)
  }));
}
  },

  watch: {
    events: {
      immediate: true,
      handler() {
        this.updateFilteredEvents();
      }
    },
    startDate() {
      this.updateFilteredEvents();
    },
    endDate() {
      this.updateFilteredEvents();
    },
    currentDepth() {
      this.updateFilteredEvents();
    },
    maxDepth() {
      this.updateFilteredEvents();
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.events-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 1px;
  left: 0;
  z-index: 2;
}

.timeline-event {
  position: absolute;
  transform: translateY(-50%);
  cursor: pointer;
}

.circle {
  width: 10px;
  height: 10px;
  background-color: $neutral-highest;
  border: 1px solid $white-unlock;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.circle::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  width: 10px;
  height: 10px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.15s;
}

.active-circle::after {
  border-color: $white-unlock;
  background-color: $secondary-hight;
}

.content {
  display: none;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 8px;
  margin-top: 4px;
  white-space: nowrap;
  width: auto;
}

.content.active {
  display: flex;
  color: $neutral-highest;
  padding: 24px 0 0 4px;
  border-left: 2px solid $neutral-highest;
  max-height: 200px;
  overflow: auto;
  margin-left: 5px;
}

.circle {
  width: 10px;
  height: 10px;
  background-color: $neutral-highest;
  border: 1px solid $white-unlock;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.active-circle {
  background-color: $secondary-hight;
}

.highlight-circle {
  background-color: $secondary-hight;
}

// Supprimez ou commentez les styles pour .content.highlight s'ils existent
</style>
