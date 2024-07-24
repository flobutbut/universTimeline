import { parseDate } from './dateUtils';

export function calculateScaledWidths(periods, parentStartDate, parentEndDate) {
  const today = new Date().getFullYear();
  const sortedPeriods = periods.sort((a, b) => a.startDate - b.startDate);
  let lastEndPosition = 0;

  return sortedPeriods.map(period => {
    const start = period.startDate === 'today' ? today : parseDate(period.startDate);
    const end = period.endDate === 'today' ? today : parseDate(period.endDate);

    let width = calculateWidth(start, end, parentStartDate, parentEndDate);
    let position = calculatePosition(start, parentStartDate, parentEndDate);

    position = Math.max(position, lastEndPosition);
    const availableWidth = 100 - position;
    width = Math.min(width, availableWidth);

    lastEndPosition = position + width;

    return {
      ...period,
      width: `${width}%`,
      position: `${position}%`
    };
  });
}

export function calculateWidth(startDate, endDate, parentStartDate, parentEndDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const parentStart = parseDate(parentStartDate);
  const parentEnd = parseDate(parentEndDate);

  const totalDuration = parentEnd - parentStart;
  const periodDuration = end - start;

  const width = (periodDuration / totalDuration) * 100;

  return Math.max(width, 0.5);
}

export function calculatePosition(date, parentStartDate, parentEndDate) {
  const normalizedDate = parseDate(date);
  const normalizedParentStart = parseDate(parentStartDate);
  const normalizedParentEnd = parseDate(parentEndDate);

  const totalDuration = normalizedParentEnd - normalizedParentStart;
  const position = ((normalizedDate - normalizedParentStart) / totalDuration) * 100;

  return Math.max(position, 0);
}

export function isRelatedEvent(activeEvent, otherEvent) {
  if (!activeEvent.branches || !otherEvent.branches) {
    return false;
  }

  const activeBranches = new Set(activeEvent.branches);
  const otherBranches = new Set(otherEvent.branches);

  for (let branch of activeBranches) {
    if (otherBranches.has(branch)) {
      return true;
    }
  }

  return false;
}

export function calculateEventPosition(date, startDate, endDate) {
  const eventDate = parseDate(date);
  const start = startDate === -Infinity ? parseDate(startDate) : parseDate(startDate);
  const end = endDate === Infinity ? parseDate(endDate) : parseDate(endDate);
  const totalDuration = end - start;
  const position = ((eventDate - start) / totalDuration) * 100;
  return `${position}%`;
}

export function shouldDisplayEvent(event, currentDepth, maxDepth) {
  const BASE = 4;
  const depthRatio = currentDepth / maxDepth;
  const weightThreshold = (1 - Math.log(depthRatio + 1) / Math.log(BASE)) * maxDepth;
  return event.weight >= weightThreshold;
}