<template>
    <div
      class="timeline-flag"
      :class="{ 'start-flag': isStart, 'end-flag': !isStart }"
    >
      <div class="content">
        <p class="textRegular textDimmed spacing_xs">{{ label }}</p>
        <p v-if="eventTitle" class="textRegular textDimmed">{{ eventTitle }}</p>
      </div>
      <div class="circle" :class="{ 'end-circle': !isStart }"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TimelineFlag",
    props: {
      label: {
        type: String,
        required: true,
      },
      eventTitle: {
        type: String,
        default: null,
      },
      isStart: {
        type: Boolean,
        default: false,
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .timeline-flag {
    position: absolute;
    bottom: -5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    height: 96px;
  }
  
  .start-flag {
    left: 0px;
    align-items: flex-start;
  }
  
  .end-flag {
    right: 0px;
    align-items: flex-end;
  }
  
  .circle {
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: -5px;
    left: -5px;
    background-color: $secondary-hight;
    border: 1px solid $white-unlock;
    border-radius: 50%;
    margin-bottom: 4px;
  }
  
  .end-circle {
    left: auto;
    right: -5px;
  }
  
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: $neutral-highest;
    padding: 0px 0 0 4px;
    border-left: 2px solid $neutral-highest;
    max-width: 200px;
    width: max-content;
    word-wrap: break-word;
    white-space: normal;
  }
  
  .end-flag .content {
    padding: 4px 4px 0 0;
    border-left: none;
    border-right: 2px solid $neutral-highest; 
    text-align: right;
  }
  </style>