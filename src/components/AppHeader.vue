<template>
  <header class="app-header">
    <div class="logo">
      <img src="@/assets/Brand/logo.svg" alt="Logo" />
    </div>
    <Button type="default" @click="openContributePage">Contribuer au projet</Button>
  </header>
</template>

<script>
import Button from "./Button.vue"; // Assurez-vous que le chemin est correct

export default {
  name: "AppHeader",
  components: {
    Button,
  },
  methods: {
    openContributePage() {
      // Pour l'instant, nous allons juste afficher une alerte
      alert("Page de contribution : À implémenter");
      // Ici, vous pourriez ajouter la logique pour ouvrir la page de contribution
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-header {
  display: flex;
  align-items: center; // Centre verticalement les éléments
  justify-content: space-between;
  padding: 16px;
  background-color: $white-lock;
}

.logo {
  display: flex;
  align-items: center; // Centre verticalement le logo
}

.logo img {
  max-height: 40px; // Ajustez selon la taille souhaitée
  width: auto;
}
</style>