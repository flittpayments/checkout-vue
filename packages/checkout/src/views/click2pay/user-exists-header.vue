<template>
  <div v-if="show" :class="$style.wrapper">
    <div :class="$style.header">
      <svg-click2pay-visa-mastercard
        :class="$uiClass('icon')"
        @click.native="goClick2pay"
      />
      <div :class="$style.right">
        <div :class="$uiClass('email')">{{ email }}</div>
        <f-link @click="goSwitchId">{{ $t('another_user') }}</f-link>
      </div>
    </div>
    <div v-if="showMessage">
      <h3 :class="$uiClass('h3')" v-text="$t('c2p_access_to_saved_cards')" />
      <div :class="$uiClass('desc')" v-text="$t('c2p_no_saved_cards')" />
    </div>
  </div>
</template>

<script>
import { getCards } from '@/click2pay'
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'
import FLink from '@/components/link'

export default {
  components: {
    SvgClick2payVisaMastercard,
    FLink,
  },
  data() {
    return {
      show: false,
      email: '',
      cards: [],
    }
  },
  computed: {
    showMessage() {
      return !this.cards.length
    },
  },
  created() {
    getCards()
      .then(({ profiles }) => {
        this.show = true
        this.email = profiles[0].maskedConsumer.maskedEmailAddress
        this.cards = profiles[0].maskedCards
      })
      .catch(() => {})
  },
  methods: {
    goClick2pay() {
      this.$router.push({ name: 'click2pay' }).catch(() => {})
    },
    goSwitchId() {
      this.$router.push({ name: 'click2pay_switch_id' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(16px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: px-to-rem(16px);
}

.icon {
  cursor: pointer;
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

.h3 {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 600;
  margin-bottom: px-to-rem(8px);
}

.h3_light {
  color: #313539;
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(8px);
}

.desc_light {
  color: #5a6470;
}

.right {
  text-align: right;
}
</style>
