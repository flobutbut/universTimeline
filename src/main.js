import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.scss';
import dataService from './services/dataService.js';

const app = createApp(App);

async function init() {
  try {
    const events = await dataService.getEvents();
    const periods = await dataService.getPeriods();
    app.provide('events', events);
    app.provide('periods', periods);
    app.mount('#app');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

init();
