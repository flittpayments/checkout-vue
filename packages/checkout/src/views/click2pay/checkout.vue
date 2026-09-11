<template>
  <div v-if="show">
    <click2pay-header
      :class="$style.mb_24"
      :email="email"
      :email-short="emailShort"
    />
    <transition name="f-fade-enter">
      <click2pay-checkout-form v-if="showRegistration" :class="$style.mb_36" />
      <div v-else :class="$style.mb_44">
        <!--$t('c2p_save_card_desc')-->
        <i18n path="c2p_save_card_desc" tag="div" :class="$uiClass('desc')">
          <template #click2pay>
            <a href="" @click.prevent="open">{{ $t('click2pay') }}</a>
          </template>
          <template #masked_card>
            <span :class="$uiClass('bold')">{{ masked_card }}</span>
          </template>
        </i18n>
        <f-button-success
          class="f-mb-24"
          :text="$t('save_card')"
          @click="click"
        />
      </div>
    </transition>
    <click2pay-modal-about ref="about" />
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import FButtonSuccess from '@/components/button/button-success'
import Click2payCheckoutForm from '@/views/click2pay/checkout-form'
import Click2payModalAbout from '@/views/click2pay/modal-about'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { getCards } from '@/click2pay'

export default {
  components: {
    Click2payHeader,
    FButtonSuccess,
    Click2payCheckoutForm,
    Click2payModalAbout,
  },
  data() {
    return {
      show: false,
      showRegistration: false,
      emailShort: '',
    }
  },
  computed: {
    ...mapState('click2pay', ['email']),
    ...mapState('order', ['order_data']),
    masked_card() {
      const card = this.order_data.masked_card.split('X').slice(-1)
      return `**** ${card}`
    },
  },
  created() {
    getCards()
      .then(({ profiles }) => {
        this.emailShort = profiles[0].maskedConsumer.maskedEmailAddress
      })
      .catch(() => {})

    this.store
      .click2payCardEncrypt({
        first_name: ' ',
        last_name: ' ',
      })
      .then(() => {
        this.show = true
      })
      .catch(errorHandler)
  },
  methods: {
    click() {
      this.showRegistration = true
    },
    open() {
      this.$refs.about.show()
    },
  },
}
</script>

<style lang="scss" module>
.desc {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(24px);
}

.desc_light {
  color: #5a6470;
}

.bold {
  font-weight: 600;
}

.bold_light {
  color: #313539;
}

.mb_24 {
  margin-bottom: px-to-rem(24px);
}

.mb_36 {
  margin-bottom: px-to-rem(36px);
}

.mb_44 {
  margin-bottom: px-to-rem(44px);
}
</style>
