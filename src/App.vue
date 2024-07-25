<template>
  <div id="app">
    <Timeline @error="handleError" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Timeline from './components/Timeline.vue';

export default defineComponent({
  name: 'App',
  components: {
    Timeline
  },
  setup() {
    const handleError = (error) => {
      console.error("An error occurred in Timeline:", error);
      // Ajoutez ici une logique pour afficher l'erreur à l'utilisateur si nécessaire
    };

    return {
      handleError
    };
  }
});
</script>

<style lang="scss">
@import "@/styles/main.scss";
</style>