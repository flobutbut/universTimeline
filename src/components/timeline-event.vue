<template>
  <div class="timeline-event" :style="{ left: `calc(${position} - 5px)` }" @mouseover="showTooltip" @mouseleave="hideTooltip" @click="toggleActive">
    <div class="circle"></div>
    <Tooltip :visible="hover && !active" :title="title" :text="date" :formattedYear="formattedYear"></Tooltip>
    <div class="content" :class="{ active: active }">
      <p class="textRegular textBlack spacing_xs">{{ title }}</p>
      <p class="textLight textDimmed">{{ formattedYear }}</p>
    </div>
  </div>
</template>

<script>
import Tooltip from './tooltip.vue';

export default {
  name: 'TimelineEvent',
  components: {
    Tooltip
  },
  props: {
    title: String,
    date: [String, Number], // Accept both String and Number
    position: String
  },
  data() {
    return {
      hover: false,
      active: false
    };
  },
  computed: {
    formattedYear() {
      return this.formatYear(this.date);
    }
  },
  methods: {
    formatYear(year) {

      if (typeof year === 'string') {
        // Attempt to convert string to number if possible
        if (!isNaN(year)) {
          year = Number(year);
        } else {
          // Check if the string is in the format yyyy-mm-dd
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          if (datePattern.test(year)) {
            const [yyyy, mm, dd] = year.split('-');
            return `${dd}/${mm}/${yyyy}`;
          } else {
            return year; // If it's a string but not in the date format, return it as it is
          }
        }
      }
      
      if (typeof year === 'number') {
        const absYear = Math.abs(year);
        if (absYear >= 1e9) {
          return `${(year / 1e9).toFixed(1)} milliards d'années`;
        } else if (absYear >= 1e6) {
          return `${(year / 1e6).toFixed(1)} millions d'années`;
        } else if (absYear >= 1e3) {
          return `${(year / 1e3).toFixed(1)} milliers d'années`;
        } else {
          return `${year} années`;
        }
      }
      
      // If the input doesn't match any expected format, return it as it is
      return year;
    },
    showTooltip() {
      this.hover = true;
    },
    hideTooltip() {
      this.hover = false;
    },
    toggleActive() {
      this.active = !this.active;
      if (this.active) {
        this.hover = false; // Hide the tooltip when the content is active
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

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
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  width: 16px; /* 12px + 2*2px border */
  height: 16px; /* 12px + 2*2px border */
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.15s;
}
.hover-circle::after {
  border-color: $white-unlock;
}
.active-circle::after {
  border-color: $white-unlock;
  z-index: 999;
}
.content {
  display: none;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 8px;
  margin-top: 4px;
  white-space: nowrap;
  width: auto; /* Makes the container width adapt to its content */
}
.content.active {
  display: flex;
  color: $neutral-highest;
  padding: 24px 0 0 4px; /* Adjust padding as necessary */
  border-left: 2px solid $neutral-highest;
  max-height: 200px; /* Set a maximum height for the active content */
  overflow: auto; /* Allows scrolling if the content exceeds the max height */
  margin-left: 5px;
}
</style>
