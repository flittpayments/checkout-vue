<template>
  <f-row v-bind="attrs" data-e2e-click2pay-cards v-on="fListeners">
    <template #text="{ item }">
      <click2pay-card-item :item="item" no-info />
    </template>
    <template #item="{ item }">
      <click2pay-card-item :item="item" variant="secondary" />
    </template>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import Click2payCardItem from '@/views/click2pay/card-item'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'

export default {
  components: {
    FRow,
    Click2payCardItem,
  },
  mixins: [attrsMixin, listenersMixin],
  inheritAttrs: false,
  props: {
    list: makeProp(PROP_TYPE_ARRAY),
  },
  computed: {
    options() {
      return this.list.map(item => ({
        data: item,
        text: item.panLastFour,
        value: item.srcDigitalCardId,
        disabled: item.digitalCardData.status !== 'ACTIVE',
      }))
    },
    attrs() {
      return {
        ...this.fAttrs,
        options: this.options,
        variantItem: 'card',
        type: 'select',
        modalWrapperClass: '',
        dropdownSize: 'card',
        rules: 'required',
        placeholder: this.$t('select_card'),
      }
    },
  },
}
</script>
