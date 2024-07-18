<template>
  <div class="periode" :style="{ left: position, width: width }" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <div class="periode-bar">
      <p class="textMedium textBlack spacing_xs">{{ title }}</p>
      <p class="textMedium textDimmed">{{ calculatedDuration }}</p>
    </div>
    <Tooltip :visible="hover" :title="title" :text="calculatedDuration" placement="top"></Tooltip>
  </div>
</template>

<script>
import Tooltip from './tooltip.vue';

export default {
  name: 'Periode',
  components: {
    Tooltip
  },
  props: {
    title: String,
    startDate: [String, Number],
    endDate: [String, Number],
    position: String,
    width: String
  },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    calculatedDuration() {
      const start = this.parseDate(this.startDate);
      const end = this.parseDate(this.endDate);
      console.log(`Start Date: ${start}, End Date: ${end}`); // Debugging log
      return this.calculateDuration(start, end);
    }
  },
  methods: {
    parseDate(date) {
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? parseInt(date) : parsedDate.getTime();
      } else {
        return date;
      }
    },
    calculateDuration(start, end) {
      const durationInYears = Math.abs(end - start) / (1000 * 60 * 60 * 24 * 365.25);
      console.log(`Duration in Years: ${durationInYears}`); // Debugging log

      if (durationInYears >= 1e9) {
        return `${(durationInYears / 1e9).toFixed(1)} milliard${durationInYears >= 2e9 ? 's' : ''} d'années`;
      } else if (durationInYears >= 1e6) {
        return `${(durationInYears / 1e6).toFixed(1)} million${durationInYears >= 2e6 ? 's' : ''} d'années`;
      } else if (durationInYears >= 1e3) {
        return `${(durationInYears / 1e3).toFixed(1)} mille ans`;
      } else if (durationInYears >= 1) {
        return `${Math.floor(durationInYears)} an${Math.floor(durationInYears) > 1 ? 's' : ''}`;
      } else {
        const durationInDays = Math.floor(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        return `${durationInDays} jour${durationInDays > 1 ? 's' : ''}`;
      }
    },
    showTooltip() {
      this.hover = true;
    },
    hideTooltip() {
      this.hover = false;
    }
  }
}
</script>

<style scoped>
.periode {
  position: absolute;
  background-color: white;
  transform: translateY(-30px);
  padding: 1px;
  height: 28px;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.periode-bar {
  background-color: rgb(220, 220, 220);
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 3px;
}
.textMedium {
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.textBlack {
  margin-right: 0px;
}
</style>
