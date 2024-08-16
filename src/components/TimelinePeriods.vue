<template>
  <div class="periods-container" :class="{ 'fading': isFading }">
    <div v-if="!periods || periods.length === 0">Aucune période à afficher</div>
    <div
      v-for="period in periods"
      :key="period.id"
      class="period"
      :class="{
        'has-children': hasChildren(period),
        'expanding': expandingPeriodId === period.id,
        'hide-period': expandingPeriodId !== null && expandingPeriodId !== period.id
      }"
      :style="{
        left: period.position,
        width: period.width,
        minWidth: '1px',
      }"
      :title="getTitle(period)"
      @click="handleClick(period)"
    >
      <div class="period-content">
        <div class="period-info">
          <p class="textRegular textBlack period-title">{{ period.title }}</p>
          <p class="textRegular textDimmed period-duration">
            {{ formatDuration(calculateDuration(period.startDate, period.endDate)) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { parseDate, formatDuration, calculateDuration } from '@/utils/dateUtils';

export default {
  name: 'PeriodsComponent',
  props: {
    periods: {
      type: Array,
      default: () => [],
    },
    expandingPeriodId: {
      type: [Number, String],
      default: null,
    },
  },
  emits: ['load-child', 'expansion-complete'],
  setup(props, { emit }) {
    const isFading = ref(false);

    const hasChildren = (period) => period.childs && period.childs.length > 0;

    const getTitle = (period) => {
      return hasChildren(period)
        ? `${period.title} - Cliquez pour voir les sous-périodes`
        : period.title;
    };

    const handleClick = (period) => {
      if (hasChildren(period)) {
        emit('load-child', period.id);
      }
    };

    watch(() => props.expandingPeriodId, (newVal, oldVal) => {
      if (newVal !== null) {
        // Début de l'expansion
        setTimeout(() => {
          // Attendre que l'expansion soit visible
          setTimeout(() => {
            isFading.value = true;
            // Attendre que le fondu soit presque terminé
            setTimeout(() => {
              emit('expansion-complete');
            }, 200); // Légèrement avant la fin du fondu
          }, 300); // Durée de l'expansion visible
        }, 50); // Court délai pour l'application de 'hide-period'
      } else if (oldVal !== null) {
        // Fin de l'expansion, réinitialisation
        isFading.value = false;
      }
    });

    return {
      isFading,
      hasChildren,
      getTitle,
      handleClick,
      formatDuration,
      calculateDuration,
    };
  },
};
</script>

<style scoped lang="scss">
.periods-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 2px; // Espace entre les périodes et la ligne centrale
  transition: opacity 0.25s ease;
  
  &.fading {
    opacity: 1;
  }
}

.period {
  position: absolute;
  height: 48px;
  min-width: 2px;
  padding: 1px;
  box-sizing: border-box;
  cursor: default;
  transition: all 0.3s ease, opacity 0.25s ease;


  &.has-children {
    cursor: pointer;
  }

  &.has-children::after {
    content: "▼";
    margin-right: 6px;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
    color: $neutral-hight;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.has-children:hover::after {
    opacity: 1;
  }

  &:hover .period-content {
    background-color: $neutral-low;
  }

  &:hover .period-duration {
    color: $neutral-hight;
  }

  &.hide-period {
    opacity: 0;
    pointer-events: none;
  }

  &.expanding {
    position: absolute;
    left: 0 !important;
    width: 100% !important;
    height: 48px !important;
    z-index: 10;
    opacity: 1 !important;
  }
}

.period-content {
  background-color: $neutral-lower;
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 3px;
  z-index: 1;
  overflow: hidden;
  padding-left: 12px;
  transition: all 0.5s ease;

  .expanding & {
    background-color: $neutral-low;
  }
}

.period-info {
  display: flex;
  flex-direction: column;
  align-items: left;
  overflow: hidden;
  min-width: 0;
  width: 100%;
}

.period-title,
.period-duration {
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
  transition: color 0.5s ease;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>