<template>
  <div class="tooltip" ref="tooltip" v-show="visible" :class="[placementClass, { 'tooltip-visible': visible }]">
    <p class="textMedium textWhite spacing_xs">{{ title }}</p>
    <p class="textMedium textDimmed">{{ text }}</p>
  </div>
</template>


  
  <script>
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
    text: {
      type: [String, Number],
      required: true
    },
    placement: {
      type: String,
      default: 'bottom' // Default to 'bottom', can be 'top' for periods
    }
  },
  computed: {
    placementClass() {
      return this.placement === 'top' ? 'tooltip-top' : 'tooltip-bottom';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {

          console.log('Tooltip is now visible'); // Consol Log

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

      console.log('Tooltip Rect:', tooltipRect); // Consol Log
      console.log('Container Rect:', containerRect); // Consol Log

      // Reset styles first
      tooltip.style.left = '50%';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'translateX(-50%)';

      if (tooltipRect.right > containerRect.right) {
        const overflowRight = tooltipRect.right - containerRect.right;

        console.log('Overflow right:', overflowRight); // Consol Log

        tooltip.style.left = `calc(50% - ${overflowRight}px)`;
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(-50%)';
      }

      if (tooltipRect.left < containerRect.left) {
        const overflowLeft = containerRect.left - tooltipRect.left;

        console.log('Overflow left:', overflowLeft); // Consol log

        tooltip.style.left = `calc(50% + ${overflowLeft}px)`;
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(-50%)';
      }
    }
  }
}
</script>


  
  <style scoped>
.tooltip {
  margin: 0;
  position: absolute;
  background-color: black;
  color: white;
  padding: 8px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 1000;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: 16px; /* Adjust to align with the parent's bottom border */
}

.tooltip-top {
  bottom: 16px; /* Adjust to align with the parent's top border */
}

.tooltip-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s;
}
  </style>
  