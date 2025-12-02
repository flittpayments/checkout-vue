<template>
  <f-button-unstyled :class="className" v-on="$listeners">
    <f-icon-bin :class="style.icon" :bin="item.card_number" />
    <div>
      <div :class="$style.number">{{ cardNumber }}</div>
      <div :class="$style['expiry-date']">
        <span v-text="$t('expires_on')" /> {{ item.expiry_date }}
      </div>
    </div>
    <div v-if="mode_test" :class="$style.marks">
      <f-button-unstyled
        v-if="approved"
        ref="approved"
        :class="$style.approved"
      >
        <f-svg name="check2" :size="24" />
      </f-button-unstyled>
      <f-button-unstyled
        v-if="declined"
        ref="declined"
        :class="$style.declined"
      >
        <f-svg name="xmark" :size="24" />
      </f-button-unstyled>
      <f-svg v-if="is3ds" :class="$style.ds3" name="3ds" :size="24" />
      <f-svg v-if="is2ds" :class="$style.ds2" name="2ds" :size="24" />
      <f-tooltip-card-list-item :target="() => $refs.approved?.$el">
        {{ $t('approved') }}
      </f-tooltip-card-list-item>
      <f-tooltip-card-list-item :target="() => $refs.declined?.$el">
        {{ $t('declined') }}
      </f-tooltip-card-list-item>
    </div>
  </f-button-unstyled>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FIconBin from '@/components/icon-bin'
import FTooltipCardListItem from '@/components/tooltip/tooltip-card-list-item'
import { mapState } from '@/utils/store'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mask } from '@/utils/mask'
import { maskCardNumber } from '@/config/mask'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FIconBin,
    FTooltipCardListItem,
  },
  props: {
    item: makeProp(PROP_TYPE_OBJECT),
  },
  computed: {
    ...mapState('params', ['card_number']),
    ...mapState(['mode_test']),
    className() {
      return [this.style.style, { [this.style.active]: this.active }]
    },
    active() {
      return this.item.card_number === this.card_number
    },
    cardNumber() {
      return mask(this.item.card_number, maskCardNumber)
    },
    approved() {
      return this.item.type === 'approved'
    },
    declined() {
      return this.item.type === 'declined'
    },
    is3ds() {
      return this.item.protocol === '3ds'
    },
    is2ds() {
      return this.item.protocol === '2ds'
    },
  },
}
</script>

<style lang="scss" module="style">
@import '@/scss/template/card-list-item.module';
</style>

<style lang="scss" module>
.number {
  margin-bottom: px-to-rem(4px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(20px);
  color: #3d3d3d;
}

.expiry-date {
  height: px-to-rem(16px);
  font-size: px-to-rem(12px);
  font-weight: 400;
  color: #818c99;
}

.marks {
  align-self: center;
  margin-left: auto;
}

.approved {
  color: #08a835;
  margin-left: px-to-rem(8px);
}

.declined {
  color: $error;
  margin-left: px-to-rem(8px);
}

.ds3 {
  color: #313539;
  margin-left: px-to-rem(8px);
}

.ds2 {
  color: #8f9395;
  margin-left: px-to-rem(8px);
}
</style>
