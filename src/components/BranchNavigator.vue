<template>
  <div class="branch-navigator">
    <div v-if="branches.length > 0" class="breadcrumb">
      <div class="back-button-container">
        <button
          v-if="breadcrumbHistory.length > 1"
          @click="goBack"
          class="back-button"
        >
          <IconArrowLeft class="back-icon" />
        </button>
      </div>
      <div class="breadcrumb-items">
        <span
          v-for="(branch, index) in breadcrumbHistory"
          :key="index"
          class="breadcrumb-item"
        >
          <span v-if="index > 0" class="separator">/</span>
          <span
            class="breadcrumb-text textRegular"
            @click="navigateToBranch(index)"
            >{{ branch.name }}</span
          >
        </span>
        <select
          v-model="selectedBranchId"
          @change="onBranchSelect"
          class="branch-select textRegular"
        >
          <option value="" disabled selected></option>
          <option
            v-for="branch in availableBranches"
            :key="branch.id"
            :value="branch.id"
          >
            {{ branch.name }}
          </option>
        </select>
      </div>
    </div>
    <div v-else>Aucune branche disponible</div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import IconArrowLeft from "@/assets/icons/IconArrowLeft.vue";

export default {
  name: "BranchNavigator",
  components: {
      IconArrowLeft,
    },
  props: {
    branches: {
      type: Array,
      required: true,
    },
    currentBranchId: {
      type: String,
      default: "overview",
    },

  },
  emits: ["branch-selected"],
  setup(props, { emit }) {
    const selectedBranchId = ref("");
    const branchHistory = ref([{ id: "overview", name: "Vue d'ensemble" }]);

    const breadcrumbHistory = computed(() => branchHistory.value);

    const availableBranches = computed(() => {
  const currentBranch = props.branches.find(
    (b) => b.id === props.currentBranchId
  );
  
  // Obtenir les IDs des branches déjà dans le fil d'Ariane
  const breadcrumbBranchIds = new Set(branchHistory.value.map(b => b.id));

  if (currentBranch && currentBranch.connections) {
    // Récupérer les IDs des branches connectées
    const connectedBranchIds = currentBranch.connections.map(conn => conn.branchId);
    // Filtrer les branches pour n'inclure que celles qui sont connectées
    // et qui ne sont pas déjà dans le fil d'Ariane
    return props.branches.filter(b => 
      connectedBranchIds.includes(b.id) && !breadcrumbBranchIds.has(b.id)
    );
  } else {
    // Si pas de connexions ou vue d'ensemble, afficher toutes les branches racines
    // qui ne sont pas déjà dans le fil d'Ariane
    return props.branches.filter(b => 
      !b.parentId && b.id !== "overview" && !breadcrumbBranchIds.has(b.id)
    );
  }
});

const onBranchSelect = () => {
  if (selectedBranchId.value) {
    const selectedBranch = props.branches.find(
      (b) => b.id === selectedBranchId.value
    );
    
    // Vérifier si la branche n'est pas déjà dans le fil d'Ariane
    if (!branchHistory.value.some(b => b.id === selectedBranch.id)) {
      branchHistory.value.push(selectedBranch);
      emit("branch-selected", selectedBranchId.value);
      selectedBranchId.value = "";
    } else {
      console.warn("Cette branche est déjà dans le fil d'Ariane");
      // Gérer ce cas, peut-être en réinitialisant la sélection ou en affichant un message à l'utilisateur
    }
  }
};

    const navigateToBranch = (index) => {
      branchHistory.value = branchHistory.value.slice(0, index + 1);
      emit("branch-selected", branchHistory.value[index].id);
    };

    watch(
      () => props.currentBranchId,
      (newBranchId) => {
        const newBranch = props.branches.find((b) => b.id === newBranchId);
        if (
          newBranch &&
          branchHistory.value[branchHistory.value.length - 1].id !== newBranchId
        ) {
          branchHistory.value.push(newBranch);
        }
      }
    );
    const goBack = () => {
  if (branchHistory.value.length > 1) {
    branchHistory.value.pop();
    const previousBranch = branchHistory.value[branchHistory.value.length - 1];
    emit("branch-selected", previousBranch.id);
  }
};

    return {
      selectedBranchId,
      breadcrumbHistory,
      availableBranches,
      onBranchSelect,
      navigateToBranch,
      goBack,
    };
  },
};
</script>

<style scoped lang="scss">
.branch-navigator {
  background-color: $neutral-lower;
  min-height: 32px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border-radius: 3px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  width: 100%;
}

.back-button-container {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 12px;
  height: 12px;
  color: $neutral-medium;
}

.back-button:hover .back-icon {
  color: $neutral-highter;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
}

.breadcrumb-item{
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.breadcrumb-text {
  cursor: pointer;
  color: $neutral-hight;
  &:hover {
    text-decoration: none;
    color: $neutral-highest;
  }
}

.separator {
  margin: 0 0.5rem;
  color: $neutral-hight;
}

.branch-select {
  appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  width: 1em;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 0.8em auto;

  &::-ms-expand {
    display: none;
  }

  option {
    color: initial;
  }
}
</style>
