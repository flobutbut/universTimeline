<template>
  <div class="periode" :style="{ left: position, width: width }" @click="handleClick">
    <div class="periode-bar">
      <p class="marginLeft textRegular textBlack spacing_xs">{{ title }}</p>
      <p class="marginLeft ellipsis textRegular textDimmed">{{ calculatedDuration }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Periode',
  props: {
    title: String,
    startDate: [String, Number],
    endDate: [String, Number],
    position: String,
    width: String,
    child: String // Ajout de la propriété child
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
      const duration = this.calculateDuration(start, end);
      return this.formatDuration(duration);
    }
  },

  //METHODES ---------------------------------------------------------------------------
  methods: {

    // ... METHODE parseDate
    parseDate(date) {
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? parseInt(date) : parsedDate.getTime();
      } else if (typeof date === 'number') {
        return date * 365.25 * 24 * 60 * 60 * 1000;
      }
      return null;
    },

    // ... METHODE calculateDuration
    calculateDuration(start, end) {
      return Math.abs(end - start);
    },
    // ... METHODE formatDuration
    formatDuration(duration) {
      const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
      const millisecondsInMonth = 30.44 * 24 * 60 * 60 * 1000;
      const millisecondsInDay = 24 * 60 * 60 * 1000;
      const millisecondsInHour = 60 * 60 * 1000;
      const millisecondsInMinute = 60 * 1000;
      const millisecondsInSecond = 1000;

      const years = duration / millisecondsInYear;
      if (years >= 1e9) {
        return `${(years / 1e9).toFixed(1)} milliard${years / 1e9 >= 2 ? 's' : ''} d'années`;
      } else if (years >= 1e6) {
        return `${(years / 1e6).toFixed(1)} million${years / 1e6 >= 2 ? 's' : ''} d'années`;
      } else if (years >= 1e3) {
        return `${(years / 1e3).toFixed(1)} mille ans`;
      } else if (years >= 1) {
        return `${Math.floor(years)} an${Math.floor(years) > 1 ? 's' : ''}`;
      }

      const months = duration / millisecondsInMonth;
      if (months >= 1) {
        return `${Math.floor(months)} mois`;
      }

      const days = duration / millisecondsInDay;
      if (days >= 1) {
        return `${Math.floor(days)} jour${Math.floor(days) > 1 ? 's' : ''}`;
      }

      const hours = duration / millisecondsInHour;
      if (hours >= 1) {
        return `${Math.floor(hours)} heure${Math.floor(hours) > 1 ? 's' : ''}`;
      }

      const minutes = duration / millisecondsInMinute;
      if (minutes >= 1) {
        return `${Math.floor(minutes)} minute${Math.floor(minutes) > 1 ? 's' : ''}`;
      }

      const seconds = duration / millisecondsInSecond;
      return `${Math.floor(seconds)} seconde${Math.floor(seconds) > 1 ? 's' : ''}`;
    },

    // ... METHODE handleClick
    handleClick() {
      if (this.child) {
        this.$emit('load-child', this.child);
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.periode {
  position: absolute;
  transform: translateY(-30px);
  padding: 1px;
  height: 28px;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.periode-bar {
  background-color: $neutral-lower;
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 3px;
}
.periode-bar:hover {
  background-color: $neutral-low;
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 3px;
  cursor: pointer;
}
p.marginLeft {
  margin-left: 6px;
}

</style>
