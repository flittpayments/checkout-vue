<template>
  <!--$t('agree_to_data_processing_terms')-->
  <i18n v-if="show" :class="$style.style" path="agree_to_data_processing_terms">
    <template #data_processing_terms>
      <f-link @click="click">{{ $t('data_processing_terms') }}</f-link>
      <f-modal-base
        v-model="modal"
        :title="$t('personal_data_processing_terms')"
        size="xl"
      >
        <span v-html="$t('data_processing_terms_desc')" />
      </f-modal-base>
    </template>
    <template #merchant_name>
      {{ title }}
    </template>
  </i18n>
</template>

<script>
import FLink from '@/components/link'
import FModalBase from '@/components/modal/modal-base'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { select } from '@/utils/dom'

export default {
  components: {
    FLink,
    FModalBase,
  },
  props: {
    hasFields: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      modal: false,
    }
  },
  computed: {
    ...mapState('options', ['title']),
    ...mapState(['fields_customer', 'fields_custom']),
    show() {
      return (
        this.hasFields ||
        this.fields_customer.length ||
        this.fields_custom.length ||
        select('#f-fields')
      )
    },
  },
  methods: {
    click() {
      this.modal = true
    },
  },
}
</script>

<style lang="scss" module>
.style {
  margin-bottom: px-to-rem(16px);
}
</style>
