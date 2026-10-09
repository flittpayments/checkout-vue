<template>
  <div v-if="show" :class="$style.wrapper">
    <f-row-checkbox
      v-if="merchant.offerta_url_show_checkbox"
      v-model="offer"
      :rules="rules"
    >
      <!--$t('offer_t')-->
      <i18n-t keypath="offer_t">
        <template #offer_terms>
          <f-link variant="secondary" :href="url" target="_blank">{{
            $t('offer_terms')
          }}</f-link>
        </template>
      </i18n-t>
    </f-row-checkbox>
    <i18n-t v-else keypath="offer_t">
      <template #offer_terms>
        <f-link variant="secondary" :href="url" target="_blank">{{
          $t('offer_terms')
        }}</f-link>
      </template>
    </i18n-t>
  </div>
</template>

<script>
import FRowCheckbox from '@/components/input/row-checkbox'
import I18nT from '@/components/base/i18n-t'
import FLink from '@/components/link'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FRowCheckbox,
    I18nT,
    FLink,
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
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(20px);
}
</style>
