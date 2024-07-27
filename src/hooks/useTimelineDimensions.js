// src/hooks/useTimelineDimensions.js

import { ref, onMounted, onUnmounted, watch } from 'vue';

export function useTimelineDimensions(timelineRef) {
  const timelineWidth = ref(0);
  const timelineHeight = ref(0);

  function updateTimelineDimensions() {
    if (timelineRef.value) {
      const newWidth = timelineRef.value.offsetWidth;
      const newHeight = timelineRef.value.offsetHeight;
      if (newWidth > 0 && newHeight > 0) {
        timelineWidth.value = newWidth;
        timelineHeight.value = newHeight;
      }
    }
  }

  function setupResizeListener() {
    window.addEventListener('resize', updateTimelineDimensions);
  }

  function cleanupResizeListener() {
    window.removeEventListener('resize', updateTimelineDimensions);
  }

  function initializeTimelineDimensions() {
    if (timelineRef.value) {
      updateTimelineDimensions();
    } else {
      const checkInterval = setInterval(() => {
        if (timelineRef.value) {
          clearInterval(checkInterval);
          updateTimelineDimensions();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }

  onMounted(() => {
    setupResizeListener();
    initializeTimelineDimensions();
  });

  onUnmounted(() => {
    cleanupResizeListener();
  });

  watch(timelineRef, (newRef) => {
    if (newRef) {
      updateTimelineDimensions();
    }
  });

  return {
    timelineWidth,
    timelineHeight,
    updateTimelineDimensions,
  };
}