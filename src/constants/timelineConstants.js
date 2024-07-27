// timelineConstants.js

// src/constants/timelineConstants.js

// Constantes pour l'état initial
export const INITIAL_LOADING_STATE = true;
export const INITIAL_SHOW_CURSOR_STATE = false;
export const INITIAL_MOUSE_POSITION = { x: 0, y: 0 };

// Constantes pour les dimensions initiales
export const INITIAL_TIMELINE_WIDTH = 0;
export const INITIAL_TIMELINE_HEIGHT = 0;

// Constantes pour la gestion des périodes et événements
export const ROOT_PERIOD_ID = 1;
export const INFINITY_DATE = 'today';
export const NEGATIVE_INFINITY_DATE = -Infinity;

// Constantes pour le calcul de l'affichage des événements
export const EVENT_WEIGHT_BASE = 4;

// Constantes pour l'animation et le rendu
export const CURSOR_UPDATE_INTERVAL = 100; // en millisecondes
export const TIMELINE_CHECK_INTERVAL = 100; // en millisecondes
export const TIMELINE_CHECK_TIMEOUT = 5000; // en millisecondes

// Constantes pour les classes CSS
export const TIMELINE_CONTAINER_CLASS = 'timeline-container';
export const TIMELINE_CONTENT_CLASS = 'timeline-content';
export const TIMELINE_LINE_CLASS = 'timeline-line';
export const PERIODS_CONTAINER_CLASS = 'periods-container';
export const EVENTS_CONTAINER_CLASS = 'events-container';

// Constantes pour les messages de log
export const MOUSE_MOVE_LOG_MESSAGE = 'Mouse moved:';
export const TIMELINE_DIMENSIONS_LOG_MESSAGE = 'Timeline dimensions updated:';
export const INVALID_DIMENSIONS_ERROR_MESSAGE = 'Invalid timeline dimensions:';

// Constantes pour la gestion des erreurs
export const DATA_LOADING_ERROR_MESSAGE = 'Error loading data:';

// Autres constantes spécifiques à votre application
export const MAX_DEPTH = 10; // Profondeur maximale de l'arborescence des périodes
export const MIN_PERIOD_WIDTH = 0.5; // Largeur minimale d'une période en pourcentage

// Constantes pour la gestion du breadcrumb
export const MAX_BREADCRUMB_ITEMS = 5; // Nombre maximum d'éléments dans le breadcrumb