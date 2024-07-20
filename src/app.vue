<template>
  <div id="app">
    <Timeline />
  </div>
</template>

<script>
import Timeline from './components/timeline.vue';

export default {
  name: 'App',
  components: {
    Timeline
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";
/* Styles globaux si nécessaire */
</style>
