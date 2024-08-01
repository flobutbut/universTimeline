// src/utils/timelineUtils.js

import { parseDate } from './dateUtils';
import {
  INFINITY_DATE,
  NEGATIVE_INFINITY_DATE,
  MIN_PERIOD_WIDTH,
  EVENT_WEIGHT_BASE
} from '@/constants/timelineConstants';

export function calculateScaledWidths(periods, startDate, endDate) {
  if (periods.length === 0) return [];

  const today = new Date().getFullYear();
  const sortedPeriods = periods.sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
  let lastEndPosition = 0;

  return sortedPeriods.map(period => {
    const start = period.startDate === INFINITY_DATE ? today : parseDate(period.startDate);
    const end = period.endDate === INFINITY_DATE ? today : parseDate(period.endDate);

    let width = calculateWidth(start, end, startDate, endDate);
    let position = calculatePosition(start, startDate, endDate);

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

  return Math.max(width, MIN_PERIOD_WIDTH);
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

  return [...activeBranches].some(branch => otherBranches.has(branch));
}

export function calculateEventPosition(date, startDate, endDate) {
  const eventDate = parseDate(date);
  const start = startDate === NEGATIVE_INFINITY_DATE ? parseDate(startDate) : parseDate(startDate);
  const end = endDate === INFINITY_DATE ? parseDate(endDate) : parseDate(endDate);
  const totalDuration = end - start;
  const position = ((eventDate - start) / totalDuration) * 100;
  return `${position}%`;
}

export function shouldDisplayEvent(event, currentDepth, maxDepth) {
  const depthRatio = currentDepth / maxDepth;
  const weightThreshold = (1 - Math.log(depthRatio + 1) / Math.log(EVENT_WEIGHT_BASE)) * maxDepth;
  return event.weight >= weightThreshold;
}