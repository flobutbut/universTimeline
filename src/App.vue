<template>
  <div class="app">
    <AppHeader class="app__header"/>
    <main class="app__main">
      <router-view v-slot="{ Component }">
        <component :is="Component" @error="handleError" />
      </router-view>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppHeader from './components/AppHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppHeader
  },
  
  setup() {
    const handleError = (error) => {
      console.error("An error occurred:", error);
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
}
</style>