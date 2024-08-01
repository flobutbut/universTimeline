import axios from 'axios';
import { parseDate } from '@/utils/dateUtils';

const dataService = {
  async getBranches() {
    const response = await axios.get('/dataJson/Branches.json');
    return response.data;
  },

  async getEvents() {
    const response = await axios.get('/dataJson/Events.json');
    const events = response.data;
    return events.map(event => ({
      ...event,
      date: parseDate(event.date),
      active: false,
      branches: (event.branches || []).map(b => parseInt(b)) // Convertir en nombres
    }));
  },

  async getPeriods() {
    const response = await axios.get('/dataJson/Periods.json');
    const periods = response.data;
  
    return periods.map(period => ({
      ...period,
      startDate: parseDate(period.startDate),
      endDate: parseDate(period.endDate),
      branches: (period.branches || []).map(b => parseInt(b)), // Convertir en nombres
      childs: Array.isArray(period.childs) ? period.childs : []
    }));
  }
};

export default dataService;