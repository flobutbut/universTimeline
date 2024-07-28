<template>
  <div class="contribute-page container">
      <section class="story-section">
        <h1>L'histoire derrière le projet</h1>
        <p class="textParagraphe textBlack">Depuis toujours, les vastes échelles de temps qui façonnent notre univers me fascinent. Pourtant, je me suis souvent rendu compte à quel point il est difficile de véritablement saisir ces immenses périodes. Combien de temps s'est écoulé depuis la formation de la Terre jusqu'à l'apparition de la vie ? Combien de temps les dinosaures ont-ils régné sur notre planète, et comment cela se compare-t-il à l'échelle de la Terre elle-même ? Et, plus largement, que représentent ces événements à l'échelle de l'univers tout entier ?</p>
        <p class="textParagraphe textBlack">Ces interrogations sont à l'origine de ce projet. J'ai voulu créer une représentation visuelle interactive de l'histoire de l'univers, une frise chronologique qui permettrait à chacun de mieux comprendre et contextualiser les événements historiques, des plus anciens aux plus récents.</p>
        <p class="textParagraphe textBlack">J'aimerais que projet repose également sur la collaboration open source. Je crois fermement que c'est grâce à l'apport collectif que nous pourrons enrichir et améliorer cette initiative, en alliant nos compétences et nos passions respectives. Ensemble, nous pouvons créer un outil de curiosité puissant et inspirant, qui ouvrira une fenêtre sur l'immensité du temps et de l'univers.</p>
      </section>
  
      <section class="contact-section">
        <h1>Me contacter et proposer des améliorations</h1>
        <p class="textParagraphe textBlack">Votre perspective est précieuse ! Si vous avez des idées pour améliorer le projet, des suggestions sur la représentation des données historiques, ou si vous souhaitez simplement partager vos réflexions, n'hésitez pas à me contacter.</p>
        <p class="textParagraphe textBlack">Envoyez-moi un email à <a href="mailto:hello@florianbutour.com" class="textParagraphe">hello@florianbutour.com</a>.</p>
        <p class="textParagraphe textBlack">Je suis toujours ouvert à discuter de ce projet et à explorer de nouvelles façons de rendre l'histoire plus accessible et engageante pour tous.</p>
      </section>
  
      <section class="github-section">
        <h1>Contribuer via GitHub</h1>
        <p class="textParagraphe textBlack">J'ai choisi de rendre ce projet open source pour permettre à la communauté de participer à son évolution. Voici comment vous pouvez contribuer :</p>
        <ul class="textParagraphe textBlack">
          <li>Visitez le <a href="https://github.com/flobutbut/universTimeline" target="_blank" class="textParagraphe">dépôt GitHub du projet</a></li>
          <li>Faites un fork du projet pour créer votre propre copie</li>
          <li>Créez une branche pour vos modifications ou améliorations</li>
          <li>Soumettez une pull request avec vos changements</li>
        </ul>
        <p class="textParagraphe textBlack">Que vous soyez développeur, historien, designer ou simplement passionné, vos contributions sont les bienvenues. N'hésitez pas à ouvrir des issues pour signaler des bugs, proposer de nouvelles fonctionnalités ou discuter d'améliorations potentielles.</p>
      </section>
      <div>
        <Button type="naked" @click="goBack" class="back-button">Retour à la chronologie de l'hunivers</Button>
      </div>

    </div>


  </template>
  
  <script>
  import Button from "./Button.vue";
  
  export default {
    name: 'ContributePage',
    components: {
      Button
    },
    methods: {
      goBack() {
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped lang="scss">

  .contribute-page {
    max-width: 640px;
    margin: 0 auto;
    padding-top: 40px;
    padding-bottom: 60px;
    position: relative; // Ajoutez ceci pour positionner le bouton de retour
  
    .back-button {
      position: relative;
      width: 100%;
      margin-bottom: 20px;
    }
  
    h1 {
      color: $neutral-highest;
      font-size: 24px;
      margin-bottom: 20px;
      padding-top: 40px; // Ajoutez ceci pour laisser de l'espace pour le bouton de retour
    }  
  
    section {
      background-color: $white-unlock;
      padding-bottom: 30px;
      margin-bottom: 30px;
      border-bottom: solid 1px $neutral-low;
    }
  
    ul {
      padding-left: 20px;
    }
  
    li {
      margin-bottom: 10px;
    }
  
    a {
      color: $primary-medium;
      text-decoration: none;
      transition: color 0.3s ease;
  
      &:hover {
        color: $primary-hight;
        text-decoration: underline;
      }
    }
  
    p {
      margin-bottom: 15px;
    }
  }
  </style>