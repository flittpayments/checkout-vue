<template>
  <f-modal-tooltip v-bind="attrs">
    <template #text>
      {{ label }}
      <f-svg ref="arrow" :class="$style.arrow" name="angle-down" size="lg" />
    </template>
    <template #default>
      <f-card-list :list="list" @input="input" />
    </template>
  </f-modal-tooltip>
</template>

<script>
import FModalTooltip from '@/components/modal-tooltip'
import FSvg from '@/components/svg'
import FCardList from '@/components/card-list'
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FModalTooltip,
    FSvg,
    FCardList,
  },
  props: {
    label: makeProp(PROP_TYPE_STRING),
  },
  emits: ['input'],
  computed: {
    ...mapState(['cards']),
    attrs() {
      return {
        ...this.$attrs,
        ref: 'mt',
        scrollable: this.list.length > 5,
        modalWrapperClass: '',
        dropdownSize: 'card',
        dropdownPlacement: 'bottom',
        dropdownArrow: true,
        dropdownPlacementTarget: () => this.$refs.arrow?.$el,
      }
    },
    list() {
      return this.cards.map(item => ({
        ...item,
        card_number: item.card_number.replace(/ /g, ''),
        expiry_date: (item.expiry_date || '').replace(/ /g, ''),
      }))
    },
  },
  created() {
    this.store.setCardNumber(this.list[0])
    this.$emit('input')
  },
  methods: {
    input() {
      this.$refs.mt.hide()
      this.$emit('input')
    },
  },
}
</script>

<style lang="scss" module>
.arrow {
  margin-left: px-to-rem(6px);
}
</style>
