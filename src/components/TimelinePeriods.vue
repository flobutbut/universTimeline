<template>
  <div class="periods-container">
    <div v-for="period in periods" :key="period.id"
        class="period"
        :class="{ 'has-children': hasChildren(period) }"
        :style="{
          left: period.position,
          width: period.width,
          minWidth: '2px'
        }"
        :title="getTitle(period)"
        @click="handleClick(period)">

        <div class="period-content">
          <div class="period-info">
            <p class="textRegular textBlack spacing_xs period-title">{{ period.title }}</p>
            <p class="textRegular textDimmed period-duration">{{ formatDuration(calculateDuration(period.startDate, period.endDate)) }}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { parseDate, formatDuration, calculateDuration } from '@/utils/dateUtils';

export default {
  name: 'PeriodsComponent',
  props: {
    periods: {
      type: Array,
      required: true
    }
  },
  methods: {
    hasChildren(period) {
      return period.childs && period.childs.length > 0;
    },

    getTitle(period) {
      if (this.hasChildren(period)) {
        return `${period.title} - Cliquez pour voir les sous-périodes`;
      }
      return period.title;
    },


    handleClick(period) {
      if (period.childs && period.childs.length > 0) {
        this.$emit('load-child', period.id);
      }
    },
    formatDuration,
    calculateDuration
  }  
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.periods-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 2px; // Espace entre les périodes et la ligne centrale
}

.period {
  position: absolute;
  height: 32px;
  min-width: 2px;
  padding: 1px;
  box-sizing: border-box;
  cursor: default;

  &.has-children {
    cursor: pointer;
  }

  &.has-children::after {
    content: '▼';
    margin-right: 6px;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
    color: $neutral-hight;
    opacity: 0; // Cachez le triangle par défaut
    transition: opacity 0.3s ease; // Ajoutez une transition douce
  }

  &.has-children:hover::after {
    opacity: 1; // Affichez le triangle au survol
  }

  &:hover .period-content {
    background-color: $neutral-low;
  }
  &:hover .period-duration {
    color: $neutral-hight;
  }
}

.period-content {
  background-color: $neutral-lower;
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 3px;
  z-index: 1;
  transition: background-color 0.3s ease;
  overflow: hidden;
  padding-left: 6px;
}

.period-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 0;
  width: 100%;
}

.period-title, .period-duration {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.period-title {
  flex: 0 0 auto;
  margin-right: 6px;
}

.period-duration {
  flex: 1 1 auto;
  min-width: 0;
  transition: color 0.3s ease;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>