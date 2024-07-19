<template>
  <button :class="buttonClass" @click="handleClick" :disabled="disabled">
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
      validator: value => ['default', 'primary', 'secondary'].includes(value)
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

<style scoped>
/* Vous pouvez supprimer ou commenter les styles locaux si vous utilisez les styles globaux */
.btn {
  padding: 4px 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-default {
  background-color: rgb(220, 220, 220);
  color: #333;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

.btn-default:hover:not(.btn-disabled) {
  background-color: rgb(210, 210, 210);
  color: #333;
}
</style>
