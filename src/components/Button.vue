<template>
  <button class="textRegular" :class="buttonClass" @click="handleClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'secondary', 'naked'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass() {
      return {
        'btn': true,
        'btn-default': this.type === 'default',
        'btn-primary': this.type === 'primary',
        'btn-secondary': this.type === 'secondary',
        'btn-naked': this.type === 'naked',
        'btn-disabled': this.disabled
      };
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    }
  }
}
</script>

<style scoped lang="scss">

/* Vous pouvez supprimer ou commenter les styles locaux si vous utilisez les styles globaux */
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-default {
  background-color: $neutral-hight;
  color: $white-unlock;
}
.btn-default:hover:not(.btn-disabled) {
  background-color: $neutral-highest;
  color: $white-unlock;
}

.btn-primary {
  background-color: $primary-medium;
  color: $white-lock;
}
.btn-primary:hover:not(.btn-disabled) {
  background-color: $primary-highter;
  color: $white-unlock;
}


.btn-secondary {
  background-color: $neutral-medium;
  color: $white-lock;
}
.btn-secondary:hover:not(.btn-disabled) {
  background-color: $neutral-highter;
  color: $white-lock;
}
.btn-naked {
  background-color: transparent;
  color: $neutral-medium;
}
.btn-naked:hover:not(.btn-disabled) {
  background-color: $neutral-lower;
  color: $neutral-highter;
}

.btn-disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}


</style>
