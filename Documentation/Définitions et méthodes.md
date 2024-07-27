# Documentation détaillée des fonctions et méthodes

## Structure du projet
/project-root
│
src/
|   |-- components/
|   |   |-- TimelineBreadcrumb.vue
|   |   |-- TimelineComponent.vue
|   |   |-- TimelineCursor.vue
|   |   |-- TimelineEvents.vue
|   |   |-- TimelinePeriods.vue
|   |-- composables/
|   |   |-- useTimelineCalculations.js
|   |   |-- useTimelineInteractions.js (nouveau)
|   |-- services/
|   |   |-- dataService.js
|   |-- utils/
|   |   |-- dateUtils.js
|   |   |-- timelineUtils.js
|   |-- hooks/ (nouveau)
|   |   |-- useTimelineDimensions.js
|   |-- constants/ (nouveau)
|   |   |-- timelineConstants.js
│
|-- public/
|   |-- index.html
|
|-- package.json


## 1. TimelineComponant.vue

### Composable setup
- Initialise l'état et les fonctions pour le composant Timeline.
- Utilise les composables `useTimelineCalculations`, `useTimelineInteractions`, et `useTimelineDimensions`.

### Méthodes:
#### initializeData
- **Fonctionnalité**: Initialise les données de la timeline.
- **Processus**:
  1. Charge les périodes et les événements via `dataService`.
  2. Trouve et charge la période racine.

#### handleEventsMouseMove(event)
- **Fonctionnalité**: Gère le mouvement de la souris dans la zone des événements.
- **Paramètres**: 
  - event: MouseEvent

### Hooks du cycle de vie:
#### onMounted
- Initialise les données et met à jour les dimensions de la timeline.

#### onUnmounted
- Effectue le nettoyage si nécessaire.

### Watchers:
#### watch(timelineRef)
- Met à jour les dimensions de la timeline lorsque la référence change.

## 2. TimelineCursor.vue

### Props:
- startDate: [Number, String]
- endDate: [Number, String]
- timelineWidth: Number
- mouseX: Number
- mouseY: Number
- containerHeight: Number

### Refs:
- cursorX
- cursorY

### Computed Properties:
#### cursorDate
- **Fonctionnalité**: Calcule la date correspondant à la position du curseur.
- **Retour**: Date (nombre)

#### formattedDate
- **Fonctionnalité**: Formate la date du curseur pour l'affichage.
- **Retour**: String (date formatée)

#### opacity
- **Fonctionnalité**: Calcule l'opacité du curseur basée sur sa position verticale.
- **Retour**: Number (entre 0 et 1)

### Watchers:
- watch(mouseX): Met à jour cursorX
- watch(mouseY): Met à jour cursorY

## 3. TimelineEvents.vue

### Computed Properties:
#### processedEvents
- **Fonctionnalité**: Filtre et traite les événements pour l'affichage.
- **Retour**: Array d'événements traités

### Méthodes:
#### isNearRightEdge(event)
- **Fonctionnalité**: Détermine si un événement est proche du bord droit de la timeline.
- **Paramètres**: 
  - event: Object (événement à vérifier)
- **Retour**: Boolean

#### handleMouseOver(event)
- **Fonctionnalité**: Gère le survol de la souris sur un événement.
- **Paramètres**: 
  - event: Object (événement survolé)

#### handleMouseLeave(event)
- **Fonctionnalité**: Gère la sortie de la souris d'un événement.
- **Paramètres**: 
  - event: Object (événement quitté)

#### toggleActive(event)
- **Fonctionnalité**: Bascule l'état actif d'un événement.
- **Paramètres**: 
  - event: Object (événement à activer/désactiver)

#### calculatePosition(date)
- **Fonctionnalité**: Calcule la position d'un événement sur la timeline.
- **Paramètres**: 
  - date: Date ou Number
- **Retour**: String (position en pourcentage)

#### formatDate(date)
- **Fonctionnalité**: Formate la date d'un événement pour l'affichage.
- **Paramètres**: 
  - date: Date ou Number
- **Retour**: String (date formatée)

#### shouldDisplayEvent(event)
- **Fonctionnalité**: Détermine si un événement doit être affiché.
- **Paramètres**: 
  - event: Object (événement à vérifier)
- **Retour**: Boolean

## 4. TimelinePeriods.vue

### Méthodes:
#### hasChildren(period)
- **Fonctionnalité**: Vérifie si une période a des enfants.
- **Paramètres**: 
  - period: Object (période à vérifier)
- **Retour**: Boolean

#### getTitle(period)
- **Fonctionnalité**: Obtient le titre d'une période.
- **Paramètres**: 
  - period: Object (période)
- **Retour**: String (titre de la période)

#### handleClick(period)
- **Fonctionnalité**: Gère le clic sur une période.
- **Paramètres**: 
  - period: Object (période cliquée)

## 5. Tooltip.vue

### Computed Properties:
#### placementClass
- **Fonctionnalité**: Détermine la classe CSS pour le placement du tooltip.
- **Retour**: String (nom de la classe)

### Méthodes:
#### getParentContainer(element)
- **Fonctionnalité**: Trouve le conteneur parent de la timeline.
- **Paramètres**: 
  - element: HTMLElement
- **Retour**: HTMLElement (conteneur parent)

#### adjustPosition()
- **Fonctionnalité**: Ajuste la position du tooltip pour qu'il reste dans les limites de la timeline.

## 6. button.vue

### Computed Properties:
#### buttonClass
- **Fonctionnalité**: Détermine les classes CSS à appliquer au bouton.
- **Retour**: Object (classes CSS)

### Méthodes:
#### handleClick(event)
- **Fonctionnalité**: Gère le clic sur le bouton.
- **Paramètres**: 
  - event: Event (événement de clic)

## 7. TimelineBreadcrumb.vue

### Méthodes:
#### navigate(index)
- **Fonctionnalité**: Navigue vers une période spécifique dans l'historique.
- **Paramètres**: 
  - index: Number (index de la période dans l'historique)

#### goBack()
- **Fonctionnalité**: Revient à la période précédente.

## 8. useTimelineCalculations.js

### État réactif:
- allPeriods, currentPeriods, events, startDate, endDate, history, currentPeriodId, currentDepth, maxDepth, breadcrumbItems, activeEventId, highlightedEventIds

### Computed Properties:
#### scaledPeriods
- **Fonctionnalité**: Calcule les largeurs mises à l'échelle des périodes actuelles.
- **Retour**: Array de périodes avec largeurs calculées

#### filteredEvents
- **Fonctionnalité**: Filtre et traite les événements pour l'affichage actuel.
- **Retour**: Array d'événements filtrés et traités

### Méthodes principales:
#### loadPeriod(period)
- **Fonctionnalité**: Charge une période spécifique dans la timeline.
- **Paramètres**: 
  - period: Object (période à charger)

#### getChildPeriods(parentPeriod)
- **Fonctionnalité**: Récupère les périodes enfants d'une période donnée.
- **Paramètres**: 
  - parentPeriod: Object (période parente)
- **Retour**: Array de périodes enfants

#### calculateMaxDepth(period)
- **Fonctionnalité**: Calcule la profondeur maximale d'une période.
- **Paramètres**: 
  - period: Object (période)
- **Retour**: Number (profondeur maximale)

#### updateBreadcrumb()
- **Fonctionnalité**: Met à jour les éléments du fil d'Ariane.

#### loadChildPeriod(childId)
- **Fonctionnalité**: Charge une période enfant.
- **Paramètres**: 
  - childId: Number ou String (ID de la période enfant)

#### goBack()
- **Fonctionnalité**: Revient à la période précédente.

#### navigateTo(index)
- **Fonctionnalité**: Navigue vers une période spécifique dans l'historique.
- **Paramètres**: 
  - index: Number (index de la période dans l'historique)

#### handleEventToggle(eventId)
- **Fonctionnalité**: Gère l'activation/désactivation d'un événement.
- **Paramètres**: 
  - eventId: Number ou String (ID de l'événement)

#### updateHighlightedEvents(activeEventId)
- **Fonctionnalité**: Met à jour les événements mis en évidence.
- **Paramètres**: 
  - activeEventId: Number ou String (ID de l'événement actif)

#### shouldDisplayEvent(event)
- **Fonctionnalité**: Détermine si un événement doit être affiché.
- **Paramètres**: 
  - event: Object (événement à vérifier)
- **Retour**: Boolean

#### updateFilteredEvents()
- **Fonctionnalité**: Met à jour la liste des événements filtrés.
- **Retour**: Array d'événements filtrés et traités

## 9. useTimelineInteractions.js

### État réactif:
- isHoveringEvents, showCursor, mouseX, mouseY

### Méthodes:
#### handleMouseMove(event)
- **Fonctionnalité**: Gère le mouvement de la souris sur la timeline.
- **Paramètres**: 
  - event: MouseEvent

#### handleMouseLeave()
- **Fonctionnalité**: Gère la sortie de la souris de la timeline.

#### handleEventsMouseEnter()
- **Fonctionnalité**: Gère l'entrée de la souris dans la zone des événements.

#### handleEventsMouseLeave(timelineWidth)
- **Fonctionnalité**: Gère la sortie de la souris de la zone des événements.
- **Paramètres**: 
  - timelineWidth: Number (largeur de la timeline)

## 10. useTimelineDimensions.js

### État réactif:
- timelineWidth, timelineHeight

### Méthodes:
#### updateTimelineDimensions()
- **Fonctionnalité**: Met à jour les dimensions de la timeline.

#### setupResizeListener()
- **Fonctionnalité**: Configure l'écouteur de redimensionnement.

#### cleanupResizeListener()
- **Fonctionnalité**: Nettoie l'écouteur de redimensionnement.

#### initializeTimelineDimensions()
- **Fonctionnalité**: Initialise les dimensions de la timeline.

### Hooks du cycle de vie:
#### onMounted
- Configure l'écouteur de redimensionnement et initialise les dimensions.

#### onUnmounted
- Nettoie l'écouteur de redimensionnement.

### Watchers:
#### watch(timelineRef)
- Met à jour les dimensions lorsque la référence change.

## 11. dataService.js

### Méthodes:
#### getEvents()
- **Fonctionnalité**: Récupère et traite les événements depuis le fichier JSON.
- **Retour**: Promise<Array> (événements traités)

#### getPeriods()
- **Fonctionnalité**: Récupère et traite les périodes depuis le fichier JSON.
- **Retour**: Promise<Array> (périodes traitées)

## 12. dateUtils.js

### Fonctions:
#### parseDate(date)
- **Fonctionnalité**: Parse une date dans un format uniforme.
- **Paramètres**: 
  - date: String, Number, ou Date
- **Retour**: Number (année)

#### calculateDuration(startDate, endDate)
- **Fonctionnalité**: Calcule la durée entre deux dates.
- **Paramètres**: 
  - startDate: String, Number, ou Date
  - endDate: String, Number, ou Date
- **Retour**: Number (durée)

#### formatDuration(duration)
- **Fonctionnalité**: Formate une durée en une chaîne lisible.
- **Paramètres**: 
  - duration: Number
- **Retour**: String (durée formatée)

#### isValidDate(date)
- **Fonctionnalité**: Vérifie si une date est valide.
- **Paramètres**: 
  - date: Date
- **Retour**: Boolean

#### compareDates(date1, date2)
- **Fonctionnalité**: Compare deux dates.
- **Paramètres**: 
  - date1: String, Number, ou Date
  - date2: String, Number, ou Date
- **Retour**: Number (différence entre les dates)

#### getYearFromDate(date)
- **Fonctionnalité**: Extrait l'année d'une date.
- **Paramètres**: 
  - date: String, Number, ou Date
- **Retour**: Number (année)

## 13. timelineUtils.js

### Fonctions:
#### calculateScaledWidths(periods, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule les largeurs mises à l'échelle des périodes.
- **Paramètres**: 
  - periods: Array (périodes)
  - parentStartDate: String, Number, ou Date
  - parentEndDate: String, Number, ou Date
- **Retour**: Array (périodes avec largeurs calculées)

#### calculateWidth(startDate, endDate, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule la largeur d'une période.
- **Paramètres**: 
  - startDate, endDate, parentStartDate, parentEndDate: String, Number, ou Date
- **Retour**: Number (largeur en pourcentage)

#### calculatePosition(date, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule la position d'une date sur la timeline.
- **Paramètres**: 
  - date, parentStartDate, parentEndDate: String, Number, ou Date
- **Retour**: Number (position en pourcentage)

#### isRelatedEvent(activeEvent, otherEvent)
- **Fonctionnalité**: Détermine si deux événements sont liés.
- **Paramètres**: 
  - activeEvent, otherEvent: Object (événements)
- **Retour**: Boolean

#### calculateEventPosition(date, startDate, endDate)
- **Fonctionnalité**: Calcule la position d'un événement sur la timeline.
- **Paramètres**: 
  - date, startDate, endDate: String, Number, ou Date
- **Retour**: String (position en pourcentage)

#### shouldDisplayEvent(event, currentDepth, maxDepth)
- **Fonctionnalité**: Détermine si un événement doit être affiché en fonction de sa profondeur.
- **Paramètres**: 
  - event: Object (événement)
  - currentDepth, maxDepth: Number
- **Retour**: Boolean