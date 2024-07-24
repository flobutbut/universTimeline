<template>
  <div class="tooltip" ref="tooltip" v-show="visible" :class="[placementClass, { 'tooltip-visible': visible }]">
    <p class="textRegular textWhite spacing_xs">{{ title }}</p>
    <p class="textRegular textDimmed">{{ formattedYear }}</p>
  </div>
</template>

<script>
import { formatDuration } from '@/utils/dateUtils';

export default {
  name: 'Tooltip',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    formattedYear: {
      type: [String],
      required: true
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  data() {
    return {
      adjustedPlacement: this.placement
    };
  },
  computed: {
    placementClass() {
      return `tooltip-${this.adjustedPlacement}`;
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.adjustPosition();
        });
      }
    }
  },
  methods: {
    getParentContainer(element) {
      while (element && element !== document.body) {
        if (element.classList.contains('timeline-container')) {
          return element;
        }
        element = element.parentElement;
      }
      return document.body;
    },
    adjustPosition() {
      const tooltip = this.$refs.tooltip;
      const tooltipRect = tooltip.getBoundingClientRect();
      const container = this.getParentContainer(tooltip);
      const containerRect = container.getBoundingClientRect();

      // Reset styles
      tooltip.style.left = '50%';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'translateX(-50%)';

      // Adjust horizontal position
      if (tooltipRect.right > containerRect.right) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '0';
        tooltip.style.transform = 'translateX(0)';
      } else if (tooltipRect.left < containerRect.left) {
        tooltip.style.left = '0';
        tooltip.style.transform = 'translateX(0)';
      }

      // Adjust vertical position
      const topSpace = tooltipRect.top - containerRect.top;
      const bottomSpace = containerRect.bottom - tooltipRect.bottom;

      if (this.placement === 'bottom' && bottomSpace < 0) {
        this.adjustedPlacement = 'top';
      } else if (this.placement === 'top' && topSpace < 0) {
        this.adjustedPlacement = 'bottom';
      } else {
        this.adjustedPlacement = this.placement;
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.tooltip {
  margin: 0;
  position: absolute;
  background-color: $neutral-highest;
  color: $white-unlock;
  padding: 8px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 1000;
  left: 50%;
  transform: translateX(-50%);
  max-width: 200px; // Ajoutez une largeur maximale
  word-wrap: break-word; // Permet le retour à la ligne des mots longs
}

.tooltip-bottom {
  top: 16px;
}

.tooltip-top {
  bottom: 16px;
}

.tooltip-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s;
}
</style>