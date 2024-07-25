<template>
  <div class="events-container">
    <div
      v-for="event in processedEvents"
      :key="event.id"
      class="timeline-event"
      :style="{ left: `calc(${calculatePosition(event.date)} - 5px)` }"
      @mouseover="handleMouseOver(event)"
      @mouseleave="handleMouseLeave(event)"
      @click="toggleActive(event)"
    >
      <div
        class="circle"
        :class="{
          'active-circle': event.active,
          'highlight-circle': event.highlight,
        }"
      ></div>

      <tooltip
        class="always-top"
        :visible="event.hover && !event.active"
        :title="event.title"
        :formattedYear="formatDate(event.date)"
        placement="bottom"
      ></tooltip>

      <div
        class="content"
        :class="{
          active: event.active,
          'left-aligned': isNearRightEdge(event) && event.active,
        }"
      >
        <p class="textRegular textBlack spacing_xs">{{ event.title }}</p>
        <p class="textLight textDimmed">{{ formatDate(event.date) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import tooltip from '@/components/Tooltip.vue';
import { parseDate, formatDuration } from "@/utils/dateUtils";
import {
  calculateEventPosition,
  shouldDisplayEvent,
} from "@/utils/timelineUtils";

export default {
  name: "EventsComponent",
  components: {
    tooltip,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    startDate: {
      type: [Number, String],
      required: true,
    },
    endDate: {
      type: [Number, String],
      required: true,
    },
    currentDepth: {
      type: Number,
      required: true,
    },
    maxDepth: {
      type: Number,
      required: true,
    },
    activeEventId: {
      type: Number,
      default: null,
    },
    highlightedEventIds: {
      type: Set,
      default: () => new Set(),
    },
  },
  emits: [
    "event-mouseenter",
    "event-mouseleave",
    "events-mouseenter",
    "events-mouseleave",
    "event-toggle",
  ],

  data() {
    return {
      hoverEventId: null,
    };
  },

  computed: {
    processedEvents() {
      const start =
        this.startDate === -Infinity ? -Infinity : parseDate(this.startDate);
      const end =
        this.endDate === Infinity ? Infinity : parseDate(this.endDate);
      return this.events
        .filter((event) => {
          const eventDate = parseDate(event.date);
          return (
            eventDate >= start &&
            eventDate <= end &&
            this.shouldDisplayEvent(event)
          );
        })
        .map((event) => ({
          ...event,
          hover: event.id === this.hoverEventId,
          active: this.activeEventId === event.id,
          highlight: this.highlightedEventIds.has(event.id),
        }));
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Si vous avez besoin d'effectuer des opérations après le rendu initial
    });
  },

  methods: {
    isNearRightEdge(event) {
    const position = parseFloat(this.calculatePosition(event.date));
    const contentWidthPx = 200; // 200px de contenu + 24px d'espace supplémentaire
    const timelineWidthPx = this.$el ? this.$el.offsetWidth : 1000; // Largeur réelle de la timeline ou valeur par défaut
    
    // Calculons la largeur du contenu en pourcentage de la timeline
    const contentWidthPercentage = (contentWidthPx / timelineWidthPx) * 100;
    
    // Un événement est considéré comme "près du bord droit" si sa position
    // plus la largeur du contenu dépasserait 95% de la largeur de la timeline
    const isNearEdge = (position + contentWidthPercentage) > 100;
    
    console.log(`Event: ${event.title}, Position: ${position.toFixed(2)}%, Content Width: ${contentWidthPercentage.toFixed(2)}%, Timeline Width: ${timelineWidthPx}px, Is near edge: ${isNearEdge}`);
    
    return isNearEdge;
  },
  
    handleMouseOver(event) {
      this.hoverEventId = event.id;
      this.$emit("event-mouseenter");
    },

    handleMouseLeave(event) {
      this.hoverEventId = null;
      this.$emit("event-mouseleave");
    },

    toggleActive(event) {
      this.$emit("event-toggle", event.id);
    },

    calculatePosition(date) {
      return calculateEventPosition(date, this.startDate, this.endDate);
    },

    formatDate(date) {
      const eventDate = parseDate(date);
      if (typeof eventDate === "number") {
        return formatDuration(Math.abs(eventDate));
      }
      return new Date(eventDate).toLocaleDateString();
    },

    shouldDisplayEvent(event) {
      return shouldDisplayEvent(event, this.currentDepth, this.maxDepth);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.events-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 2px; // Petit espace au-dessus de la ligne centrale
  left: 0;
  z-index: 2;
}

.timeline-event {
  position: absolute;
  top: -2px;
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
  z-index: 2;
}

.content.active {
  display: flex;
  color: $neutral-highest;
  padding: 24px 0 0 4px;
  border-left: 2px solid $neutral-highest;
  max-height: 200px;
  max-width: 200px;
  width: max-content;
  word-wrap: break-word;
  white-space: normal;
  overflow: auto;
  margin-left: 5px;
}

.content.active.left-aligned {
  right: 0;
  padding: 24px 4px 0 0;
  border-left: none;
  border-right: 2px solid $neutral-highest;
  margin-left: 0;
  margin-right: 5px;
  align-items: flex-end;
  text-align: right;
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

.always-top {
  z-index: 999;
}
// Supprimez ou commentez les styles pour .content.highlight s'ils existent
</style>
