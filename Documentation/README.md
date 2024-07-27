# universTimeline

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
├── public/
│   └── index.html
│
└── package.json


## À propos du projet

En tant que designer, je n'ai pas de connaissances approfondies en développement d'applications web. J'ai donc demandé l'aide de ChatGPT et claude pour ce projet.

## Commandes utiles

### Pour générer le .dist et lancer le projet
yarn build
yarn serve

### Pour pusher sur GitHub
git add 'nom du fichier'   # Ajouter des fichiers
git status                 # Voir l'état de la branche
git commit -m "détail du commit"
git push

### Pour récupérer les modifications sur toutes les branches
git pull

### Pour changer de branche
git checkout nomDeLaBranche