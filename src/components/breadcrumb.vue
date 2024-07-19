<template>
  <div class="breadcrumb">
    <button v-if="historyLength > 0" @click="goBack" class="back-button">←</button>
    <span v-for="(item, index) in items" :key="index" class="breadcrumb-item">
      <span @click="navigate(index)" :class="index === items.length - 1 ? 'breadcrumb-link h2' : 'breadcrumb-link textDimmed'">
        {{ item }}
      </span>
      <span v-if="index < items.length - 1" class="textDimmed"> / </span>
    </span>
  </div>
</template>


<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      required: true
    },
    historyLength: {
      type: Number,
      required: true
    }
  },
  methods: {
    navigate(index) {
      if (index < this.historyLength) {
        this.$emit('navigate', index);
      }
    },
    goBack() {
      this.$emit('back');
    }
  }
}
</script>


<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}
.breadcrumb-item {
  margin-right: 5px;
  cursor: pointer;
}
.breadcrumb-link {
  text-decoration: none;
}
.breadcrumb-link:hover {
  text-decoration: none;
  color: black;
}

.breadcrumb-link.h2 {
  text-decoration: none;
  font-size: 16px;
}
.back-button {
  margin-right: 10px;
  border: none;
  height: 100%;
  border-radius: 3px;
}
.back-button:hover {
  cursor: pointer;
}
</style>
