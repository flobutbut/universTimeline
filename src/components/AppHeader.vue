<template>
  <header class="app-header">
    <div class="logo" @click="goToHome">
      <img src="@/assets/Brand/logo.svg" alt="Logo" />
    </div>
    <Button type="default" @click="openContributePage">Contribuer au projet</Button>
  </header>
</template>

<script>
import Button from "./Button.vue";

export default {
  name: "AppHeader",
  components: {
    Button,
  },
  methods: {
    openContributePage() {
      this.$router.push('/contribute');
    },
    goToHome() {
      this.$router.push('/');
    }
  },
};
</script>

<style scoped lang="scss">

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: $white-lock;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer; // Ajoutez ceci pour indiquer que le logo est cliquable
}

.logo img {
  max-height: 40px;
  width: auto;
}
</style>