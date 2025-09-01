<template>
  <div v-if="show" :class="$style.wrapper">
    <f-row-checkbox
      v-if="merchant.offerta_url_show_checkbox"
      v-model="offer"
      :rules="rules"
    >
      <span v-html="text" />
    </f-row-checkbox>
    <div v-else v-html="text" />
  </div>
</template>

<script>
import FRowCheckbox from '@/components/input/row-checkbox'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FRowCheckbox,
  },
  computed: {
    ...mapStateGetSet('params', ['offer', 'lang']),
    ...mapState('options', ['offerta_url']),
    ...mapState('info', ['merchant']),
    show() {
      return this.url
    },
    rules() {
      return { required: true }
    },
    url() {
      return this.$te('offerta_url')
        ? this.$t(`offerta_url`)
        : (this.offerta_url || '').replace(/{lang}/g, this.lang)
    },
    text() {
      return this.$t('offer_t', [this.url])
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(20px);
}
</style>
