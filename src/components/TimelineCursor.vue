<template>
  <div
    class="timeline-cursor textRegular"
    :style="{
      left: `${cursorX}px`,
      top: `${cursorY}px`,
      opacity: opacity,
    }"
  >
    {{ formattedDate }}
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { parseDate, formatDuration } from "@/utils/dateUtils";
import {
  NEGATIVE_INFINITY_DATE,
  INFINITY_DATE,
} from "@/constants/timelineConstants";

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
    containerHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const cursorX = ref(props.mouseX);
    const cursorY = ref(props.mouseY);

    watch(
      () => props.mouseX,
      (newX) => {
        cursorX.value = newX;
      }
    );

    watch(
      () => props.mouseY,
      (newY) => {
        cursorY.value = newY;
      }
    );

    const cursorDate = computed(() => {
      if (props.timelineWidth <= 0) return null;

      const start = parseDate(props.startDate);
      const end = parseDate(props.endDate);
      const totalDuration = end - start;
      const currentPosition = cursorX.value / props.timelineWidth;
      return Math.round(start + totalDuration * currentPosition);
    });

    const formattedDate = computed(() => {
      if (cursorDate.value === null) return "";

      const date = cursorDate.value;
      if (date === NEGATIVE_INFINITY_DATE) {
        return "Début de l'univers";
      }
      if (date === INFINITY_DATE) {
        return "Aujourd'hui";
      }
      if (date < 0) {
        return `Il y a ${formatDuration(Math.abs(date))}`;
      } else if (date === 0) {
        return "Aujourd'hui";
      } else {
        return `Dans ${formatDuration(date)}`;
      }
    });

    const opacity = computed(() => {
  // Calculez le ratio de position (0 en bas, 1 en haut)
  const ratio = 1 - (cursorY.value / props.containerHeight);
  
  // Appliquez une fonction d'ease-in quadratique
  // Cette fonction commencera lentement et accélérera vers la fin
  const easeInQuad = (t) => t * t;
  
  // Appliquez la fonction d'ease-in et assurez-vous que l'opacité reste entre 0 et 1
  return Math.max(0, Math.min(1, easeInQuad(ratio)));
});

    return {
      cursorX,
      cursorY,
      formattedDate,
      opacity,
    };
  },
};
</script>

<style scoped lang="scss">
//@import "@/styles/main.scss";

.timeline-cursor {
  position: absolute;
  color: $neutral-medium;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  transform: translate(-50%, 100%);
}
</style>
