<template>
    <div 
    class="timeline-cursor" 
    :style="{ 
        left: `${positionX}px`, 
        top: `${positionY}px`,
        opacity: cursorOpacity
    }"
    >
    {{ formattedDate }}
    </div>
</template>

<script>
import { parseDate, formatDuration } from '@/utils/dateUtils';

export default {
    name: 'TimelineCursor',
    props: {
    startDate: {
        type: [Number, String],
        required: true
    },
    endDate: {
        type: [Number, String],
        required: true
    },
    timelineWidth: {
        type: Number,
        required: true
    },
    mouseX: {
        type: Number,
        required: true
    },
    mouseY: {
        type: Number,
        required: true
    }
    },
    computed: {
    positionY() {
        return this.mouseY + 182;
    },
    positionX() {
        return this.mouseX;
    },
    cursorDate() {
        const start = parseDate(this.startDate);
        const end = parseDate(this.endDate);
        const totalDuration = end - start;
        const currentPosition = this.mouseX / this.timelineWidth;
        return start + (totalDuration * currentPosition);
    },
    formattedDate() {
        return formatDuration(Math.abs(this.cursorDate));
    },
    cursorOpacity() {
    const centerY = this.$parent.$el.offsetHeight / 2 - 16;
    if (this.mouseY < centerY/20) {
        return 0;
    } else {
        const distance = Math.abs(this.mouseY - centerY);
        const maxDistance = this.$parent.$el.offsetHeight / 2 + 48; // La moitié inférieure de l'élément parent
        return Math.min(1, distance / maxDistance);
    }
}
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.timeline-cursor {
    position: absolute;
    transform: translate(-50%, -100%);
    color: $neutral-highest;
    font-size: 12px;
    pointer-events: none;
    transition: opacity 0.1s ease-out;
}
</style>

