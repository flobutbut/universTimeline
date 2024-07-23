import { parseDate, calculateDuration } from './dateUtils';

const dataService = {
  async getEvents() {
    const response = await fetch('/dataJson/Events.json');
    const events = await response.json();
    return events.map(event => ({
      ...event,
      date: parseDate(event.date),
      active: false // Ajout d'une propriété pour gérer l'état actif
    }));
  },

  async getPeriods() {
    // Cette méthode reste inchangée
    const response = await fetch('/dataJson/Periods.json');
    const periods = await response.json();

    periods.forEach(period => {
      period.startDate = parseDate(period.startDate);
      period.endDate = parseDate(period.endDate);

      if (Array.isArray(period.childs)) {
        period.childs = period.childs.map(id => {
          const child = periods.find(p => p.id == id);
          if (child) {
            child.startDate = parseDate(child.startDate);
            child.endDate = parseDate(child.endDate);
          }
          return child || { id, title: 'Unknown', startDate: null, endDate: null, childs: [] };
        });
      } else {
        period.childs = [];
      }
    });

    return periods;
  }
};

export default dataService;