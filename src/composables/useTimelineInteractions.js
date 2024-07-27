// src/composables/useTimelineInteractions.js

import { ref, onMounted, onUnmounted } from 'vue';

export function useTimelineInteractions(timelineRef) {
  const isHoveringEvents = ref(false);
  const showCursor = ref(false);
  const mouseX = ref(0);
  const mouseY = ref(0);

  function handleMouseMove(event) {
    if (timelineRef.value) {
      const rect = timelineRef.value.getBoundingClientRect();
      mouseX.value = event.clientX - rect.left;
      mouseY.value = event.clientY - rect.top;
      showCursor.value = true;
    }
  }

  function handleMouseLeave() {
    showCursor.value = false;
    isHoveringEvents.value = false;
  }

  function handleEventsMouseEnter() {
    isHoveringEvents.value = true;
    showCursor.value = true;
  }

  function handleEventsMouseLeave(timelineWidth) {
    isHoveringEvents.value = false;
    if (mouseX.value >= 0 && mouseX.value <= timelineWidth) {
      showCursor.value = true;
    } else {
      showCursor.value = false;
    }
  }

  onMounted(() => {
    if (timelineRef.value) {
      timelineRef.value.addEventListener('mousemove', handleMouseMove);
      timelineRef.value.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onUnmounted(() => {
    if (timelineRef.value) {
      timelineRef.value.removeEventListener('mousemove', handleMouseMove);
      timelineRef.value.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  return {
    isHoveringEvents,
    showCursor,
    mouseX,
    mouseY,
    handleMouseMove,
    handleMouseLeave,
    handleEventsMouseEnter,
    handleEventsMouseLeave,
  };
}