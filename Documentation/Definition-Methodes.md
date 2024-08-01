# Documentation du projet Timeline

## Table des matières
1. Configuration du projet
2. Composants
3. Composables (Hooks personnalisés)
4. Services
5. Utilitaires
6. Styles
7. Routing

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


## 1. Configuration du projet

### 1.1 package.json

#### Scripts:
- serve: Lance le serveur de développement
- build: Construit l'application pour la production
- lint: Exécute le linter sur le code
- clean: Nettoie le dossier dist et le cache de Node.js

#### Dépendances principales:
- axios: ^1.7.2
- vue: ^3.3.0
- vue-router: 4

#### Dépendances de développement:
- @vue/cli-service: ^5.0.0
- @vue/compiler-sfc: ^3.3.0
- rimraf: ^6.0.1
- sass: 1.32.13
- sass-loader: 10.1.1

### 1.2 vue.config.js

#### Configuration Webpack:
##### resolve.alias
- **Fonctionnalité**: Définit un alias pour le dossier src.
- **Valeur**: '@' pointe vers le dossier 'src/'

#### Configuration CSS:
##### css.loaderOptions.sass
- **Fonctionnalité**: Ajoute des données supplémentaires à tous les fichiers Sass.
- **Valeur**: Importe automatiquement le fichier main.scss dans tous les composants.

## 2. Composants

### 2.1 TimelineComponent.vue

#### Composable setup
- Initialise l'état et les fonctions pour le composant Timeline.
- Utilise les composables `useTimelineCalculations`, `useTimelineInteractions`, et `useTimelineDimensions`.

#### Méthodes:
##### initializeData
- **Fonctionnalité**: Initialise les données de la timeline.
- **Processus**:
  1. Charge les périodes et les événements via `dataService`.
  2. Trouve et charge la période racine.

##### handleEventsMouseMove(event)
- **Fonctionnalité**: Gère le mouvement de la souris dans la zone des événements.
- **Paramètres**: 
  - event: MouseEvent

#### Hooks du cycle de vie:
##### onMounted
- Initialise les données et met à jour les dimensions de la timeline.

##### onUnmounted
- Effectue le nettoyage si nécessaire.

#### Watchers:
##### watch(timelineRef)
- Met à jour les dimensions de la timeline lorsque la référence change.

### 2.2 TimelineCursor.vue

#### Props:
- startDate: [Number, String]
- endDate: [Number, String]
- timelineWidth: Number
- mouseX: Number
- mouseY: Number
- containerHeight: Number

#### Refs:
- cursorX
- cursorY

#### Computed Properties:
##### cursorDate
- **Fonctionnalité**: Calcule la date correspondant à la position du curseur.
- **Retour**: Date (nombre)

##### formattedDate
- **Fonctionnalité**: Formate la date du curseur pour l'affichage.
- **Retour**: String (date formatée)

##### opacity
- **Fonctionnalité**: Calcule l'opacité du curseur basée sur sa position verticale.
- **Retour**: Number (entre 0 et 1)

#### Watchers:
- watch(mouseX): Met à jour cursorX
- watch(mouseY): Met à jour cursorY

### 2.3 TimelineEvents.vue

#### Computed Properties:
##### processedEvents
- **Fonctionnalité**: Filtre et traite les événements pour l'affichage.
- **Retour**: Array d'événements traités

#### Méthodes:
##### isNearRightEdge(event)
- **Fonctionnalité**: Détermine si un événement est proche du bord droit de la timeline.
- **Paramètres**: 
  - event: Object (événement à vérifier)
- **Retour**: Boolean

##### handleMouseOver(event)
- **Fonctionnalité**: Gère le survol de la souris sur un événement.
- **Paramètres**: 
  - event: Object (événement survolé)

##### handleMouseLeave(event)
- **Fonctionnalité**: Gère la sortie de la souris d'un événement.
- **Paramètres**: 
  - event: Object (événement quitté)

##### toggleActive(event)
- **Fonctionnalité**: Bascule l'état actif d'un événement.
- **Paramètres**: 
  - event: Object (événement à activer/désactiver)

##### calculatePosition(date)
- **Fonctionnalité**: Calcule la position d'un événement sur la timeline.
- **Paramètres**: 
  - date: Date ou Number
- **Retour**: String (position en pourcentage)

##### formatDate(date)
- **Fonctionnalité**: Formate la date d'un événement pour l'affichage.
- **Paramètres**: 
  - date: Date ou Number
- **Retour**: String (date formatée)

##### shouldDisplayEvent(event)
- **Fonctionnalité**: Détermine si un événement doit être affiché.
- **Paramètres**: 
  - event: Object (événement à vérifier)
- **Retour**: Boolean

### 2.4 TimelinePeriods.vue

#### Méthodes:
##### hasChildren(period)
- **Fonctionnalité**: Vérifie si une période a des enfants.
- **Paramètres**: 
  - period: Object (période à vérifier)
- **Retour**: Boolean

##### getTitle(period)
- **Fonctionnalité**: Obtient le titre d'une période.
- **Paramètres**: 
  - period: Object (période)
- **Retour**: String (titre de la période)

##### handleClick(period)
- **Fonctionnalité**: Gère le clic sur une période.
- **Paramètres**: 
  - period: Object (période cliquée)

### 2.5 Tooltip.vue

#### Computed Properties:
##### placementClass
- **Fonctionnalité**: Détermine la classe CSS pour le placement du tooltip.
- **Retour**: String (nom de la classe)

#### Méthodes:
##### getParentContainer(element)
- **Fonctionnalité**: Trouve le conteneur parent de la timeline.
- **Paramètres**: 
  - element: HTMLElement
- **Retour**: HTMLElement (conteneur parent)

##### adjustPosition()
- **Fonctionnalité**: Ajuste la position du tooltip pour qu'il reste dans les limites de la timeline.

### 2.6 Button.vue

#### Props:
- type: String (default, primary, secondary)
- disabled: Boolean

#### Computed Properties:
##### buttonClass
- **Fonctionnalité**: Détermine les classes CSS à appliquer au bouton.
- **Retour**: Object (classes CSS)

#### Méthodes:
##### handleClick(event)
- **Fonctionnalité**: Gère le clic sur le bouton.
- **Paramètres**: 
  - event: Event (événement de clic)

### 2.7 TimelineBreadcrumb.vue

#### Props:
- items: Array (requis)
- historyLength: Number (requis)

#### Méthodes:
##### navigate(index)
- **Fonctionnalité**: Navigue vers une période spécifique dans l'historique.
- **Paramètres**: 
  - index: Number (index de la période dans l'historique)

##### goBack()
- **Fonctionnalité**: Revient à la période précédente.

### 2.8 BranchNavigator.vue

#### Props:
- `branches`: Array (requis)
- `currentBranchId`: String (défaut: "overview")

#### Computed Properties:
##### breadcrumbHistory
- **Fonctionnalité**: Calcule l'historique de navigation des branches.
- **Retour**: Array of Objects (branches dans le chemin de navigation)

##### availableBranches
- **Fonctionnalité**: Calcule les branches disponibles pour la sélection.
- **Retour**: Array of Objects (branches disponibles)

#### Méthodes:
##### onBranchSelect()
- **Fonctionnalité**: Gère la sélection d'une nouvelle branche.

##### navigateToBranch(index)
- **Fonctionnalité**: Navigue vers une branche spécifique dans l'historique.
- **Paramètres**: 
  - index: Number (index de la branche dans l'historique)

##### goBack()
- **Fonctionnalité**: Revient à la branche précédente dans l'historique.

## 3. Composables (Hooks personnalisés)

### 3.1 useTimelineCalculations.js

Ajout des fonctionnalités liées aux branches :

#### État réactif:
- `currentBranchId`, `branches`, `rootBranches`, `availableBranches`

#### Computed Properties:
##### currentBranch
- **Fonctionnalité**: Renvoie la branche actuelle.
- **Retour**: Object (branche actuelle)

#### Méthodes:
##### loadBranches()
- **Fonctionnalité**: Charge les données des branches.

##### setCurrentBranch(branchId)
- **Fonctionnalité**: Définit la branche actuelle et met à jour les périodes filtrées.
- **Paramètres**: 
  - branchId: String (ID de la branche à définir comme actuelle)

##### updateAvailableBranches()
- **Fonctionnalité**: Met à jour la liste des branches disponibles en fonction de la branche actuelle.

##### findMacroPeriods(branchId)
- **Fonctionnalité**: Trouve les périodes macro pour une branche donnée.
- **Paramètres**:
  - branchId: String (ID de la branche)
- **Retour**: Array of Objects (périodes macro)

##### isEventInCurrentBranch(event)
- **Fonctionnalité**: Vérifie si un événement appartient à la branche actuelle.
- **Paramètres**:
  - event: Object (événement à vérifier)
- **Retour**: Boolean

##### updateFilteredEvents()
- **Fonctionnalité**: Met à jour la liste des événements filtrés en fonction de la branche actuelle.

##### updateFilteredPeriods()
- **Fonctionnalité**: Met à jour la liste des périodes filtrées en fonction de la branche actuelle.

### 3.2 useTimelineInteractions.js

#### État réactif:
- isHoveringEvents, showCursor, mouseX, mouseY

#### Méthodes:
##### handleMouseMove(event)
- **Fonctionnalité**: Gère le mouvement de la souris sur la timeline.
- **Paramètres**: 
  - event: MouseEvent

##### handleMouseLeave()
- **Fonctionnalité**: Gère la sortie de la souris de la timeline.

##### handleEventsMouseEnter()
- **Fonctionnalité**: Gère l'entrée de la souris dans la zone des événements.

##### handleEventsMouseLeave(timelineWidth)
- **Fonctionnalité**: Gère la sortie de la souris de la zone des événements.
- **Paramètres**: 
  - timelineWidth: Number (largeur de la timeline)

### 3.3 useTimelineDimensions.js

#### État réactif:
- timelineWidth, timelineHeight

#### Méthodes:
##### updateTimelineDimensions()
- **Fonctionnalité**: Met à jour les dimensions de la timeline.

##### setupResizeListener()
- **Fonctionnalité**: Configure l'écouteur de redimensionnement.

##### cleanupResizeListener()
- **Fonctionnalité**: Nettoie l'écouteur de redimensionnement.

##### initializeTimelineDimensions()
- **Fonctionnalité**: Initialise les dimensions de la timeline.

## 4. Services

### 4.1 dataService.js

#### Méthodes:
##### getBranches()
- **Fonctionnalité**: Récupère les données des branches depuis le fichier JSON.
- **Retour**: Promise<Array> (branches)

##### getEvents()
- **Fonctionnalité**: Récupère et traite les événements depuis le fichier JSON.
- **Retour**: Promise<Array> (événements traités)

##### getPeriods()
- **Fonctionnalité**: Récupère et traite les périodes depuis le fichier JSON.
- **Retour**: Promise<Array> (périodes traitées)

## 5. Utilitaires

### 5.1 dateUtils.js

#### Fonctions:
##### parseDate(date)
- **Fonctionnalité**: Parse une date dans un format uniforme.
- **Paramètres**: 
  - date: String, Number, ou Date
- **Retour**: Number (année)

##### calculateDuration(startDate, endDate)
- **Fonctionnalité**: Calcule la durée entre deux dates.
- **Paramètres**: 
  - startDate: String, Number, ou Date
  - endDate: String, Number, ou Date
- **Retour**: Number (durée)

##### formatDuration(duration)
- **Fonctionnalité**: Formate une durée en une chaîne lisible.
- **Paramètres**: 
  - duration: Number
- **Retour**: String (durée formatée)

##### isValidDate(date)
- **Fonctionnalité**: Vérifie si une date est valide.
- **Paramètres**: 
  - date: Date
- **Retour**: Boolean
##### compareDates(date1, date2)
- **Fonctionnalité**: Compare deux dates.
- **Paramètres**: 
  - date1: String, Number, ou Date
  - date2: String, Number, ou Date
- **Retour**: Number (différence entre les dates)

##### getYearFromDate(date)
- **Fonctionnalité**: Extrait l'année d'une date.
- **Paramètres**:
  - date: String, Number, ou Date
- **Retour**: Number (année)

##### formatTimelineDate(date)
- **Fonctionnalité**: Formate une date pour l'affichage sur la timeline.
- **Paramètres**: 
  - date: Number ou String
- **Retour**: String (date formatée)

### 5.2 timelineUtils.js

#### Fonctions:
##### calculateScaledWidths(periods, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule les largeurs mises à l'échelle des périodes.
- **Paramètres**: 
  - periods: Array (périodes)
  - parentStartDate: String, Number, ou Date
  - parentEndDate: String, Number, ou Date
- **Retour**: Array (périodes avec largeurs calculées)

##### calculateWidth(startDate, endDate, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule la largeur d'une période.
- **Paramètres**: 
  - startDate, endDate, parentStartDate, parentEndDate: String, Number, ou Date
- **Retour**: Number (largeur en pourcentage)

##### calculatePosition(date, parentStartDate, parentEndDate)
- **Fonctionnalité**: Calcule la position d'une date sur la timeline.
- **Paramètres**: 
  - date, parentStartDate, parentEndDate: String, Number, ou Date
- **Retour**: Number (position en pourcentage)

##### isRelatedEvent(activeEvent, otherEvent)
- **Fonctionnalité**: Détermine si deux événements sont liés.
- **Paramètres**: 
  - activeEvent, otherEvent: Object (événements)
- **Retour**: Boolean

##### calculateEventPosition(date, startDate, endDate)
- **Fonctionnalité**: Calcule la position d'un événement sur la timeline.
- **Paramètres**: 
  - date, startDate, endDate: String, Number, ou Date
- **Retour**: String (position en pourcentage)

##### shouldDisplayEvent(event, currentDepth, maxDepth)
- **Fonctionnalité**: Détermine si un événement doit être affiché en fonction de sa profondeur.
- **Paramètres**: 
  - event: Object (événement)
  - currentDepth, maxDepth: Number
- **Retour**: Boolean

## 6. Styles

### 6.1 main.scss

- Définit les variables de couleur pour l'application
- Établit les styles de base pour le corps et l'application
- Définit des classes utilitaires pour la typographie et l'espacement

## 7. Routing

### 7.1 index.js

#### Routes:
- '/': Composant Timeline (page d'accueil)
- '/contribute': Composant ContributePage (page de contribution)

#### Configuration:
- Utilise createWebHistory pour la gestion de l'historique