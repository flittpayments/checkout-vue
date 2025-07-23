<template>
  <div :class="$style.style">
    <f-icon :name="logo" :type="method" :class="$style.icon" size="48" />
    <div :class="$style.mr_12">{{ name }}</div>

    <slot />
    <f-button-close :class="$style.close" @click="click" />
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import FButtonClose from '@/components/button/button-close'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FIcon,
    FButtonClose,
  },
  props: {
    logo: makeProp(PROP_TYPE_STRING),
    method: makeProp(PROP_TYPE_STRING),
    name: makeProp(PROP_TYPE_STRING),
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: relative;
  display: flex;
  align-items: center;
  padding: px-to-rem(12px);
  margin-bottom: px-to-rem(12px);
  background-color: $bank_select_bg;
  border-radius: $border-radius;
}

.icon {
  margin-right: px-to-rem(12px);
  border-radius: $border-radius;
}

.mr_12 {
  margin-right: px-to-rem(12px);
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: px-to-rem(20px);
  font-size: px-to-rem(28px);
  font-weight: 300;
  color: $bank_select_close_color;

  &:hover {
    color: $bank_select_close_hover_color;
  }
}
</style>
