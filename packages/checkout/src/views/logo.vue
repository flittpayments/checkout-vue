<template>
  <div :class="$style.style" :style="style" />
</template>

<script>
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { logo } from '@/config/logo'

export default {
  props: {
    defaultValue: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState('options', ['logo_url', 'theme']),
    style() {
      return {
        'background-image': `url("${this.url.replace(/"/g, "'")}")`,
      }
    },
    url() {
      return this.logo_url && !this.defaultValue
        ? this.logo_url
        : logo[this.theme.type]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: contain;
}
</style>
