<template>
  <div>
    <header class="header">
      <h1>Header</h1>
    </header>
    <section class="section-red">
      <p>This is the red section.</p>
    </section>
    <section class="section-blue">
      <p>This is the blue section.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.header {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}

.section-red {
  background-color: red;
  padding: 20px;
  color: white;
}

.section-blue {
  background-color: blue;
  padding: 20px;
  color: white;
}
</style>
