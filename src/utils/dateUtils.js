// src/utils/dateUtils.js

import {
  INFINITY_DATE,
  NEGATIVE_INFINITY_DATE,
  YEAR_IN_MILLISECONDS,
  MONTH_IN_MILLISECONDS,
  DAY_IN_MILLISECONDS,
  HOUR_IN_MILLISECONDS,
  MINUTE_IN_MILLISECONDS,
  SECOND_IN_MILLISECONDS
} from '@/constants/timelineConstants';


export function formatTimelineDate(date) {
  if (date === NEGATIVE_INFINITY_DATE) {
    return "Début de l'univers";
  }
  if (date === INFINITY_DATE) {
    return "Aujourd'hui";
  }
  if (typeof date === 'number') {
    if (date < 0) {
      return `Il y a ${formatDuration(Math.abs(date))}`;
    } else if (date === 0) {
      return "Aujourd'hui";
    } else {
      return `Dans ${formatDuration(date)}`;
    }
  }
  return new Date(date).toLocaleDateString();
}

export function parseDate(date) {
  if (date === INFINITY_DATE) {
    return new Date().getFullYear();
  }
  if (typeof date === 'string') {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(date).getFullYear();
    }
    const parsedDate = parseInt(date, 10);
    if (!isNaN(parsedDate)) {
      return parsedDate;
    }
  }
  return date;
}

export function calculateDuration(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return Math.abs(end - start);
}

export function formatDuration(duration) {
  const formatPart = (value, singular, plural) => 
    `${value.toFixed(1)} ${value === 1 ? singular : plural}`;

  if (duration >= 1e9) {
    return formatPart(duration / 1e9, "milliard d'années", "milliards d'années");
  } else if (duration >= 1e6) {
    return formatPart(duration / 1e6, "million d'années", "millions d'années");
  } else if (duration >= 1e3) {
    return formatPart(duration / 1e3, "millier d'années", "milliers d'années");
  } else if (duration >= 1) {
    return formatPart(Math.floor(duration), "an", "ans");
  } else if (duration >= 1/12) {
    return formatPart(Math.floor(duration * 12), "mois", "mois");
  } else if (duration >= 1/365.25) {
    return formatPart(Math.floor(duration * 365.25), "jour", "jours");
  } else if (duration >= 1/8766) {
    return formatPart(Math.floor(duration * 8766), "heure", "heures");
  } else if (duration >= 1/525960) {
    return formatPart(Math.floor(duration * 525960), "minute", "minutes");
  } else {
    return formatPart(Math.floor(duration * 31557600), "seconde", "secondes");
  }
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

export function compareDates(date1, date2) {
  const parsedDate1 = parseDate(date1);
  const parsedDate2 = parseDate(date2);
  return parsedDate1 - parsedDate2;
}

export function getYearFromDate(date) {
  if (date === INFINITY_DATE) {
    return new Date().getFullYear();
  }
  if (date === NEGATIVE_INFINITY_DATE) {
    return NEGATIVE_INFINITY_DATE;
  }
  const parsedDate = parseDate(date);
  return typeof parsedDate === 'number' ? parsedDate : new Date(parsedDate).getFullYear();
}