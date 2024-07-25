<template>
    <div
      class="timeline-cursor"
      :style="{
        left: `${mouseX}px`,
        top: `${mouseY}px`,
      }"
    >
      {{ formattedDate }}
    </div>
  </template>
  
  <script>
  import { computed } from "vue";
  import { parseDate, formatDuration } from "@/utils/dateUtils";
  
  export default {
    name: "TimelineCursor",
    props: {
      startDate: {
        type: [Number, String],
        required: true,
      },
      endDate: {
        type: [Number, String],
        required: true,
      },
      timelineWidth: {
        type: Number,
        required: true,
      },
      mouseX: {
        type: Number,
        required: true,
      },
      mouseY: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const cursorDate = computed(() => {
        const start = parseDate(props.startDate);
        const end = parseDate(props.endDate);
        const totalDuration = end - start;
        const currentPosition = props.mouseX / props.timelineWidth;
        return Math.round(start + totalDuration * currentPosition);
      });
  
      const formattedDate = computed(() => {
        const yearsBefore = Math.abs(cursorDate.value);
        if (cursorDate.value < 0) {
          return `${formatDuration(yearsBefore)} avant aujourd'hui`;
        } else {
          return `${cursorDate.value}`;
        }
      });
  
      return {
        formattedDate,
      };
    },
  };
  </script>
  
  <style scoped>
  .timeline-cursor {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    white-space: nowrap;
  }
  </style>