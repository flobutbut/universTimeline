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

import { inject } from '@vercel/analytics';
inject();

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



.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}  
.app__header {
    flex-shrink: 0;
  }
  
.app__main {
    flex-grow: 1;
    flex-direction: column;
    display: flex;
    padding: 16px;
  }

</style>