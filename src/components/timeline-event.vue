<template>
  <div class="timeline-event" :style="{ left: `calc(${position} - 5px)` }" @mouseover="showTooltip" @mouseleave="hideTooltip" @click="toggleActive">
    <div class="circle"></div>
    <Tooltip :visible="hover && !active" :title="title" :text="date"></Tooltip>
    <div class="content" :class="{ active: active }">
      <p class="textMedium textBlack spacing_xs">{{ title }}</p>
      <p class="textMedium textDimmed">{{ date }}</p>
    </div>
  </div>
</template>


<script>import Tooltip from './tooltip.vue';

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
  methods: {
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

<style scoped>
.timeline-event {
  position: absolute;
  transform: translateY(-50%);
  cursor: pointer;
}
.circle {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 1px solid white;
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
  border-color: white;
}
.active-circle::after {
  border-color: white;
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
  color: black;
  padding: 24px 0 0 4px; /* Adjust padding as necessary */
  border-left: 2px solid black;
  max-height: 200px; /* Set a maximum height for the active content */
  overflow: auto; /* Allows scrolling if the content exceeds the max height */
  margin-left: 5px;
}
</style>
