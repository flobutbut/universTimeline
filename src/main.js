import { createApp } from 'vue';
import App from './App.vue';
import dataService from './services/dataService.js';
import router from './router'; // Ajoutez cette ligne

const app = createApp(App);

async function init() {
  try {
    const events = await dataService.getEvents();
    const periods = await dataService.getPeriods();
    app.provide('events', events);
    app.provide('periods', periods);
    app.use(router); // Ajoutez cette ligne
    app.mount('#app');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

init();
