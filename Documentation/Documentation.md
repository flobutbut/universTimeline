# Documentation du projet Timeline

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

## Objectif du projet
Le projet Timeline est une application web interactive qui présente une chronologie détaillée de l'histoire de l'univers, de la Terre et de l'humanité. L'application permet aux utilisateurs de naviguer à travers différentes périodes historiques, d'explorer des événements spécifiques et de visualiser les relations entre différentes branches de connaissances.

## Architecture générale
L'application est construite avec Vue.js 3 et utilise une architecture basée sur des composants. Les principales parties de l'application sont :

1. Composants Vue (dans le dossier `src/components`)
2. Services pour la gestion des données (dans `src/services`)
3. Utilitaires pour les calculs et le formatage (dans `src/utils`)
4. Hooks personnalisés (composables) pour la logique réutilisable (dans `src/composables`)
5. Fichiers de données JSON (dans `public/dataJson`)

## Dépendances principales
- Vue.js 3.3.0
- Axios 1.7.2 (pour les requêtes HTTP)
- Sass pour le stylage

## Structure des données
Les données sont structurées en trois fichiers JSON principaux :

1. `Branches.json` : Définit les différentes branches de connaissances et leurs relations.
2. `Events.json` : Contient les événements historiques avec leurs dates, poids et tags.
3. `Periods.json` : Définit les périodes historiques, leurs dates de début et de fin, et leurs relations hiérarchiques.

## Composants principaux

### 1. App.vue
Composant racine de l'application.

### 2. TimelineComponant.vue
[Reste inchangé]

### 3. TimelinePeriods.vue
[Reste inchangé]

### 4. TimelineEvents.vue
[Reste inchangé]

### 5. TimelineCursor.vue
[Reste inchangé]

### 6. TimelineBreadcrumb.vue
[Reste inchangé]

### 7. Button.vue
Composant réutilisable pour les boutons.
- Supporte différents types de boutons (default, primary, secondary).
- Gère l'état désactivé.
- Émet un événement de clic lorsqu'il est activé.

### 8. Tooltip.vue
[Reste inchangé]

### 9. AppHeader.vue
Composant d'en-tête de l'application.
- Affiche le logo de l'application.
- Contient un bouton pour accéder à la page de contribution.
## Services

### dataService.js
Gère le chargement des données depuis les fichiers JSON.

Méthodes principales :
- `getEvents()` : Charge et traite les événements.
- `getPeriods()` : Charge et traite les périodes.

## Utilitaires

### dateUtils.js
Fournit des fonctions pour le traitement et le formatage des dates.

Fonctions principales :
- `parseDate(date)`
- `calculateDuration(startDate, endDate)`
- `formatDuration(duration)`
- `isValidDate(date)`
- `compareDates(date1, date2)`
- `getYearFromDate(date)`

### timelineUtils.js
Contient des fonctions utilitaires spécifiques à la timeline.

Fonctions principales :
- `calculateScaledWidths(periods, parentStartDate, parentEndDate)`
- `calculateWidth(startDate, endDate, parentStartDate, parentEndDate)`
- `calculatePosition(date, parentStartDate, parentEndDate)`
- `isRelatedEvent(activeEvent, otherEvent)`
- `calculateEventPosition(date, startDate, endDate)`
- `shouldDisplayEvent(event, currentDepth, maxDepth)`

## Hooks personnalisés (Composables)

### useTimelineCalculations.js
Gère les calculs liés à la timeline, y compris le chargement des périodes et des événements, la navigation entre les périodes, et la gestion des événements actifs.

### useTimelineInteractions.js
Gère les interactions utilisateur avec la timeline, comme le mouvement de la souris et les survols.

### useTimelineDimensions.js
Gère les dimensions de la timeline et les mises à jour lors du redimensionnement de la fenêtre.
- Fournit des méthodes pour initialiser et mettre à jour les dimensions de la timeline.
- Gère les écouteurs d'événements pour le redimensionnement de la fenêtre.
- Offre des valeurs réactives pour la largeur et la hauteur de la timeline.

## Gestion de l'état
L'application utilise principalement la composition API de Vue 3 pour gérer l'état local des composants. Les données partagées sont gérées via l'injection de dépendances (`provide/inject`) plutôt qu'un store global.

## Points importants
1. La timeline utilise une échelle logarithmique pour représenter de vastes périodes de temps.
2. Les événements sont filtrés en fonction de leur "poids" et de la profondeur actuelle de la timeline.
3. L'application gère des dates allant du Big Bang à aujourd'hui, nécessitant une gestion spéciale des très grands nombres et de l'infini.

## Conventions de codage
- Utilisation de la composition API de Vue 3
- Composants fonctionnels quand possible
- Styles scoped avec Sass
- Nommage en camelCase pour les fonctions et variables
- Nommage en PascalCase pour les composants