<template>
  <i18n-t v-bind="attrs">
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </i18n-t>
</template>

<script>
import { I18nT } from 'vue-i18n'

export default {
  components: {
    I18nT,
  },
  computed: {
    attrs() {
      return {
        scope: 'global',
        ...this.$attrs,
      }
    },
  },
}
</script>
