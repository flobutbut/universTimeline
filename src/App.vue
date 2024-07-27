<template>
  <div class="app">
    <AppHeader class="app__header"/>
    <main class="app__main">
      <Timeline class="app__timeline" @error="handleError" />
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Timeline from './components/TimelineComponant.vue';
import AppHeader from './components/AppHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    Timeline,
    AppHeader
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

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  &__header {
    flex-shrink: 0;
  }
  
  &__main {
    flex-grow: 1;
    padding: 16px;
  }
  
  &__timeline {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
}
</style>