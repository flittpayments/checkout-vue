<template>
  <div :class="$style.wrapper">
    <f-button-unstyled
      v-if="showAdd"
      :class="[style.style, $style.add]"
      @click="setCardNumber({})"
    >
      <f-svg name="plus-circle" :class="style.icon" size="lg" fw />
      <span v-text="$t('use_other_card')" />
    </f-button-unstyled>
    <f-card-list-item
      v-for="item in list"
      :key="item.card_number"
      :item="item"
      @click="setCardNumber(item)"
    />
  </div>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FCardListItem from '@/components/card-list-item'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FCardListItem,
  },
  props: {
    list: makeProp(PROP_TYPE_ARRAY),
  },
  computed: {
    ...mapState(['mode_test']),
    showAdd() {
      return !this.mode_test
    },
  },
  methods: {
    setCardNumber(card) {
      this.store.setCardNumber(card)

      this.$emit('input')
    },
  },
}
</script>

<style lang="scss" module="style">
@import '@/scss/template/card-list-item.module';
</style>

<style lang="scss" module>
.wrapper {
  min-width: px-to-rem(360px);
}

.add {
  align-items: center;
  font-weight: 500;
}
</style>
