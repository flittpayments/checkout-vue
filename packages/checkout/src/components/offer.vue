<template>
  <div v-if="show" :class="['f-offer', $style.wrapper]">
    <f-form-group
      v-if="merchant.offerta_url_show_checkbox"
      v-model="offer"
      name="offer"
      component="checkbox"
      :rules="rules"
    >
      <!--$t('offer_t')-->
      <i18n path="offer_t">
        <template #offer_terms>
          <a :href="url" target="_blank">{{ $t('offer_terms') }}</a>
        </template>
      </i18n>
    </f-form-group>
    <i18n v-else path="offer_t">
      <template #offer_terms>
        <a :href="url" target="_blank">{{ $t('offer_terms') }}</a>
      </template>
    </i18n>
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
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
