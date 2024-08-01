<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb">
      <div class="back-button-container">
        <button v-if="historyLength > 1" @click="goBack" class="back-button">
          <IconArrowLeft class="back-icon" />
        </button>
      </div>
      <div class="breadcrumb-items">
        <template v-for="(item, index) in items" :key="index">
          <span v-if="index < items.length - 1" class="breadcrumb-item">
            <span @click="navigate(index)" class="breadcrumb-link textDimmed textRegular truncate">
              {{ item }}
            </span>
            <span class="separator textDimmed textRegular"> / </span>
          </span>
          <span v-else class="breadcrumb-item textRegular">
            <span class="active-link truncate">
              {{ item }}
            </span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import IconArrowLeft from '@/assets/icons/IconArrowLeft.vue';

export default {
  name: 'Breadcrumb',
  components: {
    IconArrowLeft
  },
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

.breadcrumb-container {
  display: flex;
  width: 100%;
  position: relative;
}

.breadcrumb {
  display: flex;
  align-items: center;
  width: 100%;
}

.back-button-container {
  position: relative;
  width: 24px;
  height: 24px;
}

.back-button {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  margin-left: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.back-button {
  position: absolute;
  top: 12px;
  left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 12px;
  height: 12px;
  transition: color 0.3s ease;
  color: $neutral-medium;
}

.back-button:hover .back-icon {
  color: $neutral-highter
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.separator {
  margin: 0 5px; // Ajoute un espace de chaque côté du séparateur
}

.breadcrumb-link {
  cursor: pointer;
  &:hover {
    text-decoration: none;
    color: $neutral-highter;
  }
}

</style>