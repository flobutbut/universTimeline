import axios from 'axios';
import { parseDate } from '@/utils/dateUtils';
import wbk from 'wikibase-sdk';

const wd = wbk({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

const dataService = {
  // ... vos méthodes existantes ...
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
  },

  async getDetailedDataFromWikidata(period) {
    const query = `
      SELECT ?subPeriod ?subPeriodLabel ?startDate ?endDate ?event ?eventLabel ?eventDate WHERE {
        ?mainPeriod rdfs:label "${period.title}"@fr.
        ?subPeriod wdt:P361 ?mainPeriod.
        ?subPeriod wdt:P580 ?startDate.
        ?subPeriod wdt:P582 ?endDate.
        ?subPeriod rdfs:label ?subPeriodLabel.
        FILTER(LANG(?subPeriodLabel) = "fr")
        
        OPTIONAL {
          ?event wdt:P585 ?eventDate.
          ?event wdt:P361 ?subPeriod.
          ?event rdfs:label ?eventLabel.
          FILTER(LANG(?eventLabel) = "fr")
        }
      }
      ORDER BY ?startDate ?eventDate
    `;
    
    const url = wd.sparqlQuery(query);
    const response = await axios.get(url);
    
    // Traitement des résultats
    const subPeriods = [];
    const events = [];
    
    response.data.results.bindings.forEach(item => {
      if (item.subPeriod && !subPeriods.some(p => p.id === item.subPeriod.value)) {
        subPeriods.push({
          id: item.subPeriod.value,
          title: item.subPeriodLabel.value,
          startDate: parseDate(item.startDate.value),
          endDate: parseDate(item.endDate.value),
          branches: period.branches // Héritage des branches du parent
        });
      }
      
      if (item.event) {
        events.push({
          id: item.event.value,
          title: item.eventLabel.value,
          date: parseDate(item.eventDate.value),
          branches: period.branches // Héritage des branches du parent
        });
      }
    });
    
    return { subPeriods, events };
  }
};

export default dataService;