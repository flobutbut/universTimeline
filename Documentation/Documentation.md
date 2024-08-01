# Documentation du projet Timeline

## Structure du projet
```
/project-root
│
├── src/
│   ├── assets/
│   │   └── icons/
│   │       └── IconArrowLeft.vue
│   │
│   ├── components/
│   │   ├── TimelineBreadcrumb.vue
│   │   ├── TimelineComponent.vue
│   │   ├── TimelineCursor.vue
│   │   ├── TimelineEvents.vue
│   │   ├── TimelinePeriods.vue
│   │   ├── TimelineFlag.vue
│   │   ├── BranchNavigator.vue
│   │   ├── Tooltip.vue
│   │   ├── AppHeader.vue
│   │   ├── Button.vue
│   │   └── ContributePage.vue
│   │
│   ├── composables/
│   │   ├── useTimelineCalculations.js
│   │   └── useTimelineInteractions.js
│   │
│   ├── services/
│   │   └── dataService.js
│   │
│   ├── utils/
│   │   ├── dateUtils.js
│   │   └── timelineUtils.js
│   │
│   ├── hooks/
│   │   └── useTimelineDimensions.js
│   │
│   ├── constants/
│   │   └── timelineConstants.js
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── styles/
│   │   └── main.scss
│   │
│   ├── App.vue
│   └── main.js
│
├── public/
│   ├── dataJson/
│   │   ├── Branches.json
│   │   ├── Events.json
│   │   └── Periods.json
│   │
│   └── index.html
│
└── package.json
```
# Documentation du projet Timeline

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
- Vue Router pour la navigation
- Axios 1.7.2 (pour les requêtes HTTP)
- Sass pour le stylage

## Structure des données

Les données sont structurées en trois fichiers JSON principaux :

1. `Branches.json` : Définit les différentes branches de connaissances et leurs relations.
2. `Events.json` : Contient les événements historiques avec leurs dates, poids et tags.
3. `Periods.json` : Définit les périodes historiques, leurs dates de début et de fin, et leurs relations hiérarchiques.

## Composants principaux

### TimelineComponent.vue

Composant principal gérant l'affichage et l'interaction avec la timeline.

- Utilise les composables `useTimelineCalculations`, `useTimelineInteractions`, et `useTimelineDimensions`.
- Gère l'initialisation des données, l'affichage des périodes, des événements et du curseur.
- Implémente la logique de chargement et de navigation entre les périodes.
- Gère l'affichage du navigateur de branches et les interactions avec celui-ci.

### TimelinePeriods.vue

- Gère l'affichage des périodes sur la timeline.
- Affiche chaque période avec son titre et sa durée.
- Permet la navigation vers les sous-périodes en cliquant sur une période parent.

### TimelineEvents.vue

- Gère l'affichage des événements sur la timeline.
- Affiche les événements sous forme de points cliquables.
- Gère l'affichage des informations détaillées des événements au clic.
- Implémente la logique de survol et de mise en évidence des événements.

### TimelineCursor.vue

- Affiche le curseur et la date correspondante lors du survol de la timeline.
- Calcule dynamiquement la position du curseur et la date associée.
- Ajuste l'opacité du curseur en fonction de sa position verticale.

### TimelineBreadcrumb.vue

- Affiche le fil d'Ariane pour la navigation dans les périodes.
- Permet la navigation rapide vers les périodes parentes.
- Inclut un bouton de retour pour revenir à la période précédente.

### BranchNavigator.vue

- Permet la navigation entre les différentes branches de connaissances.
- Affiche une structure de fil d'Ariane pour les branches et sous-branches.
- Permet la sélection de branches via un menu déroulant.
- Gère l'historique de navigation des branches et permet de revenir en arrière.
- S'intègre avec le composant TimelineComponent pour filtrer les périodes et événements par branche.


### Tooltip.vue

- Affiche des infobulles pour les événements et autres éléments interactifs.
- S'ajuste automatiquement pour rester dans les limites de la timeline.
- Supporte différents placements (haut, bas).

## Services

### dataService.js

Gère le chargement des données depuis les fichiers JSON.

- `getBranches()` : Charge les données des branches.
- `getEvents()` : Charge et traite les événements.
- `getPeriods()` : Charge et traite les périodes.

## Utilitaires

### dateUtils.js

Fournit des fonctions pour le traitement et le formatage des dates.

### timelineUtils.js

Contient des fonctions utilitaires spécifiques à la timeline, notamment pour le calcul des positions et largeurs des éléments.

### Hooks personnalisés (Composables)

### useTimelineCalculations.js

Gère les calculs liés à la timeline, y compris :
- Le chargement des périodes et des événements
- La navigation entre les périodes
- La gestion des événements actifs
- Le chargement et la gestion des branches
- Le filtrage des périodes et événements par branche
- La mise à jour des branches disponibles en fonction de la navigation

Nouvelles fonctionnalités :
- `loadBranches()` : Charge les données des branches depuis le service.
- `setCurrentBranch(branchId)` : Définit la branche actuelle et met à jour les périodes et événements filtrés.
- `updateAvailableBranches()` : Met à jour la liste des branches disponibles en fonction de la navigation actuelle.
- `findMacroPeriods(branchId)` : Trouve les périodes macro pour une branche donnée.
- `isEventInCurrentBranch(event)` : Vérifie si un événement appartient à la branche actuelle.
- `updateFilteredEvents()` et `updateFilteredPeriods()` : Mettent à jour les listes filtrées en fonction de la branche actuelle.


### useTimelineInteractions.js

Gère les interactions utilisateur avec la timeline, comme le mouvement de la souris et les survols.

### useTimelineDimensions.js

Gère les dimensions de la timeline et les mises à jour lors du redimensionnement de la fenêtre.

## Routing

Le projet utilise Vue Router pour la navigation. Les routes principales sont :

- `/` : Page d'accueil avec le composant Timeline
- `/contribute` : Page de contribution

## Styles

Les styles globaux sont définis dans `main.scss`, qui inclut :
- Définition des variables de couleur
- Styles de base pour le corps et l'application
- Classes utilitaires pour la typographie et l'espacement

## Gestion de l'état

L'application utilise principalement la composition API de Vue 3 pour gérer l'état local des composants. Les données partagées sont gérées via l'injection de dépendances (`provide/inject`) plutôt qu'un store global.





## Fonctionnalités clés

- Navigation interactive à travers différentes périodes historiques.
- Affichage d'événements sur une timeline avec des informations détaillées.
- Filtrage des événements et périodes par branches de connaissances.
- Système de navigation breadcrumb pour les périodes et les branches.
- Curseur interactif affichant la date actuelle sur la timeline.
- Tooltips informatifs pour les événements et autres éléments interactifs.
- Design responsive s'adaptant à différentes tailles d'écran.
- Navigation avancée entre les branches de connaissances avec un historique de navigation.
- Filtrage dynamique des périodes et événements en fonction de la branche sélectionnée.
- Mise à jour automatique des branches disponibles en fonction du contexte de navigation.


## Points importants

1. La timeline utilise une échelle logarithmique pour représenter de vastes périodes de temps.
2. Les événements sont filtrés en fonction de leur "poids", de la profondeur actuelle de la timeline, et de la branche sélectionnée.
3. L'application gère des dates allant du Big Bang à aujourd'hui, nécessitant une gestion spéciale des très grands nombres et de l'infini.
4. L'interface utilisateur est conçue pour être intuitive et informative, avec des transitions fluides et des interactions réactives.
5. La gestion des branches permet une exploration ciblée de l'histoire selon différents domaines de connaissances.
6. L'interface de navigation des branches s'adapte dynamiquement au contexte, affichant les sous-branches pertinentes.
7. Le système de filtrage par branche est optimisé pour maintenir des performances fluides même avec un grand nombre d'événements et de périodes.
