<template>
  <div :class="$style.wrapper">
    <svg-click2pay-visa-mastercard :class="$uiClass('icon')" />
    <div :class="$style.right">
      <div v-if="emailShort" :class="$uiClass('email')">{{ emailShort }}</div>
      <div v-else-if="email" :class="$uiClass('email')">{{ emailText }}</div>
      <slot />
    </div>
  </div>
</template>

<script>
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    SvgClick2payVisaMastercard,
  },
  props: {
    email: makeProp(PROP_TYPE_STRING),
    emailShort: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    emailText() {
      const [name, domain] = this.email.split('@')
      return `${name.slice(0, 2)}***@${domain}`
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  min-width: px-to-rem(149px);
}

.icon_light {
  color: #1434cb;
}

.icon_dark {
  color: #fff;
}

.email {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);
}

.email_light {
  color: #5a6470;
}

.email_dark {
  color: #fff;
}

.right {
  text-align: right;
}
</style>
