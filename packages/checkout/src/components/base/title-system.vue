<template>
  <div class="f-system">
    <f-icon :name="logo" :type="method" class="f-system-icon" size="48" />
    <div class="f-system-name">{{ name }}</div>

    <slot />
    <f-button-close class="f-system-close" @click="click" />
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
