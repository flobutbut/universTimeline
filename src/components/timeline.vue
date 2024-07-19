<template>
  <div class="timeline-container">
    <div class="timeline-head">
      <Breadcrumb :items="breadcrumbItems" :historyLength="history.length" @navigate="navigateTo" @back="goBack"></Breadcrumb>
    </div>
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
        :child="period.child"
        @load-child="loadChildPeriod"
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
import Breadcrumb from './breadcrumb.vue';
import data from '../data/data.json';

export default {
  name: 'Timeline',
  components: {
    TimelineEvent,
    Periode,
    Breadcrumb
  },

  data() {
    return {
      mainTitle: data.mainTitle,
      startDate: this.parseDate(data.startDate),
      endDate: this.parseDate(data.endDate),
      events: [],
      periods: [],
      history: [] // Pour stocker l'historique des états précédents
    };
  },

  computed: {
    breadcrumbItems() {
      return this.history.map(state => state.mainTitle).concat(this.mainTitle);
    }
  },

  created() {
    this.initializeTimeline(data);
  },

  methods: {
    initializeTimeline(timelineData) {
      this.mainTitle = timelineData.mainTitle;
      this.startDate = this.parseDate(timelineData.startDate);
      this.endDate = this.parseDate(timelineData.endDate);
      this.events = timelineData.events.map(event => ({
        ...event,
        date: event.date.toString(),
        position: this.calculatePosition(this.parseDate(event.date))
      }));
      this.periods = this.calculateScaledWidths(timelineData.periods);
    },

    async loadChildPeriod(childFile) {
      console.log('Loading child period:', childFile); // Debugging line
      try {
        // Ajouter l'état actuel à l'historique avant de charger les nouvelles données
        const currentState = this.getCurrentState();
        console.log('Current state to push:', JSON.stringify(currentState, null, 2)); // Debugging line
        this.history.push(currentState);
        console.log('History after push:', JSON.stringify(this.history, null, 2)); // Debugging line

        // Utilisation de l'importation dynamique
        const childData = await import(`../data/${childFile}.json`);
        this.initializeTimeline(childData);
      } catch (error) {
        console.error("Error loading child period data:", error);
      }
    },

    getCurrentState() {
      return {
        mainTitle: this.mainTitle,
        startDate: this.startDate,
        endDate: this.endDate,
        events: this.events,
        periods: this.periods
      };
    },

    goBack() {
      if (this.history.length > 0) {
        console.log('History before pop:', JSON.stringify(this.history, null, 2)); // Debugging line
        const previousState = this.history[this.history.length - 1]; // Obtenir l'état précédent sans le supprimer
        this.history.pop(); // Supprimer l'état après l'avoir récupéré
        console.log('Restoring state:', JSON.stringify(previousState, null, 2)); // Debugging line
        this.restoreState(previousState);
        console.log('History after pop:', JSON.stringify(this.history, null, 2)); // Debugging line
      } else {
        console.log('No history to go back to.');
      }
    },

    restoreState(state) {
      if (state) {
        this.mainTitle = state.mainTitle;
        this.startDate = state.startDate;
        this.endDate = state.endDate;
        this.events = state.events.map(event => ({
          ...event,
          position: this.calculatePosition(this.parseDate(event.date))
        }));
        this.periods = this.calculateScaledWidths(state.periods);
      }
    },

    navigateTo(index) {
      if (index < this.history.length) {
        console.log('Navigating to index:', index); // Debugging line
        const targetState = this.history[index];
        console.log('Target state:', JSON.stringify(targetState, null, 2)); // Debugging line
        this.history = this.history.slice(0, index);
        console.log('History after slice:', JSON.stringify(this.history, null, 2)); // Debugging line
        this.restoreState(targetState);
        console.log('History after restoration:', JSON.stringify(this.history, null, 2)); // Debugging line
      } else {
        console.log('Index out of range:', index);
      }
    },

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

.timeline-head {
  display: flex;
  color: black;
  margin-top: 16px;
  margin-left: 16px;
}
</style>
