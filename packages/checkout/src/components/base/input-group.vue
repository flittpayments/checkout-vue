<template>
  <div :class="className">
    <slot />
  </div>
</template>

<script>
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  props: {
    noMargin: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    className() {
      return [
        'f-row',
        'f-no-gutters',
        this.$style.style,
        {
          [this.$style.mb_0]: this.noMargin,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
:global(#f) .style {
  margin-bottom: px-to-rem(16px);

  > :first-child {
    input,
    button {
      border-right: none;
      border-radius: $border-radius 0 0 $border-radius;
    }
  }

  > :last-child {
    input,
    button,
    select {
      border-radius: 0 $border-radius $border-radius 0;
      border-left: none;
    }
  }

  > :not(:first-child):not(:last-child) {
    input {
      border-right: none;
      border-left: none;
      border-radius: 0;
    }
  }

  > * {
    margin: 0;

    &::after {
      position: absolute;
      top: px-to-rem(8px);
      right: 0;
      width: px-to-rem(1px);
      height: px-to-rem(40px);
      content: '';
      background-color: $input_border;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }
  }

  input,
  button {
    &:focus {
      position: relative;
      z-index: 1;
    }
  }

  label {
    z-index: 2;
  }
}

.mb_0 {
  margin-bottom: 0;
}
</style>
