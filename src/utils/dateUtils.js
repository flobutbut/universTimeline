// src/services/dateUtils.js

export function parseDate(date) {
    if (date === 'today') {
    const result = new Date().getFullYear();
    return result;
    }
    if (typeof date === 'string') {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const result = new Date(date).getFullYear();
        return result;
    }
    const parsedDate = parseInt(date, 10);
    if (!isNaN(parsedDate)) {
        console.log('Parsed integer string as:', parsedDate);
        return parsedDate; // Retourne directement l'année
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
    if (duration >= 1e9) {
    return `${(duration / 1e9).toFixed(1)} milliard${duration / 1e9 >= 2 ? 's' : ''} d'années`;
    } else if (duration >= 1e6) {
    return `${(duration / 1e6).toFixed(1)} million${duration / 1e6 >= 2 ? 's' : ''} d'années`;
    } else if (duration >= 1e3) {
    return `${(duration / 1e3).toFixed(1)} mille ans`;
    } else if (duration >= 1) {
    return `${Math.floor(duration)} an${Math.floor(duration) > 1 ? 's' : ''}`;
    } else if (duration >= 1/12) {
      const months = Math.floor(duration * 12);
    return `${months} mois`;
    } else if (duration >= 1/365.25) {
      const days = Math.floor(duration * 365.25);
    return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (duration >= 1/8766) {
      const hours = Math.floor(duration * 8766);
    return `${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (duration >= 1/525960) {
      const minutes = Math.floor(duration * 525960);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      const seconds = Math.floor(duration * 31557600);
    return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }
}