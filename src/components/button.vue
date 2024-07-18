<template>
    <button :class="buttonClass" @click="handleClick">
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
  .btn {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .btn-default {
    background-color: #f0f0f0;
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
  
  .btn:hover:not(.btn-disabled) {
    opacity: 0.8;
  }
  </style>
  