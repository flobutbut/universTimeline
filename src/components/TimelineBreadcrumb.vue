<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb">
      <button v-if="historyLength > 0" @click="goBack" class="back-button"> </button>
      <div class="breadcrumb-items">
        <span v-for="(item, index) in items.slice(0, -1)" :key="index" class="breadcrumb-item">
          <span @click="navigate(index)" class="breadcrumb-link textDimmed textRegular">
            {{ item }}
          </span>
          <span v-if="index < items.length - 2" class="textDimmed textRegular" > / </span>
        </span>
      </div>
    </div>
    <div v-if="items.length > 0" class="active-item h2">
      <span class="active-link">
        {{ items[items.length - 1] }}
      </span>
    </div>
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


<style scoped lang="scss">
@import "@/styles/main.scss";

.active-item{
  padding-left: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center; /* Centre les éléments horizontalement */
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  margin-left: 0px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  margin-right: 5px;
  cursor: pointer;
}

.breadcrumb-link {
  text-decoration: none;
}
.breadcrumb-link:hover {
  text-decoration: none;
  color: $neutral-highest;
}

.breadcrumb-link.h2 {
  text-decoration: none;
  font-size: 16px;
}
.back-button {
  background-image: url("../assets/icons/arrow-left.svg");
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 8px;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 3px;
  background-color: $white-unlock;
  opacity: 0.3;
}

.back-button:hover {
  cursor: pointer;
  opacity: 1;
}
</style>
