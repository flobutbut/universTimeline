<template>
  <div class="timeline-container">
    <div class="timeline-head h2">{{mainTitle}}</div>
    <div class="timeline"></div>
    <div class="periods">
      <Periode
        v-for="period in periods"
        :key="period.id"
        :title="period.title"
        :startDate="period.startDate"
        :endDate="period.endDate"
        :position="period.position"
        :width="period.width"
      />
    </div>
    <div class="events">
      <TimelineEvent
        v-for="event in events"
        :key="event.id"
        :title="event.title"
        :date="event.date"
        :position="event.position"
      />
    </div>
  </div>
</template>

<script>
import TimelineEvent from './timeline-event.vue';
import Periode from './periode.vue';
import data from '../data/data.json';

export default {
  name: 'Timeline',
  components: {
    TimelineEvent,
    Periode
  },
  data() {
    return {
      mainTitle: data.mainTitle,
      startDate: this.parseDate(data.startDate),
      endDate: this.parseDate(data.endDate),
      events: [],
      periods: []
    };
  },
  created() {
    this.events = data.events.map(event => ({
      ...event,
      date: event.date.toString(), // Ensure date is a string
      position: this.calculatePosition(this.parseDate(event.date))
    }));
    this.periods = this.calculateScaledWidths(data.periods);
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
    calculatePosition(date) {
      const start = this.startDate;
      const end = this.endDate;
      const totalDuration = end - start;
      const position = ((date - start) / totalDuration) * 100;
      return `${position}%`;
    },
    calculateWidth(startDate, endDate) {
      const start = this.startDate;
      const end = this.endDate;
      const periodStart = this.parseDate(startDate);
      const periodEnd = this.parseDate(endDate);
      const totalDuration = end - start;
      const periodDuration = periodEnd - periodStart;
      const width = (periodDuration / totalDuration) * 100;
      return `${width}%`;
    },
    calculateScaledWidths(periods) {
      return periods.map(period => {
        const width = this.calculateWidth(period.startDate, period.endDate);
        const position = this.calculatePosition(this.parseDate(period.startDate));
        return {
          ...period,
          width,
          position
        };
      });
    }
  }
}
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: white;
  border: solid 1px rgb(230, 230, 230);
  border-radius: 8px;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  overflow: hidden; /* Ensure no scrollbars */
}

.timeline {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: black;
  transform: translateY(-50%);
}

.periods {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  z-index: 1; /* Ensure periods are below events */
}

.events {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  z-index: 2; /* Ensure events are above periods */
}

.timeline-head{
  color: black;
  margin-top: 16px;
  margin-left: 16px;
}

</style>
