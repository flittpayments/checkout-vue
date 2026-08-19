<template>
  <f-container>
    <click2pay-header :class="$style.mb_16" :email-short="email">
      <f-link @click="goSwitchId">{{ $t('another_user') }}</f-link>
    </click2pay-header>
    <h3 :class="$style.h3" v-text="$t('c2p_access_to_saved_cards')" />
    <div :class="$style.desc" v-text="$t('c2p_otp_desc', { email, phone })" />
    <div v-if="second" :class="$style.time">
      <span v-text="$t('invite_new_code', { time })" />
    </div>
    <div v-else :class="$style.resend">
      <f-link @click="click">{{ $t('send_again') }}</f-link>
    </div>
    <f-form v-slot="{ submit, disabled }" @submit="onSubmit">
      <f-otp
        v-model="validationData"
        :disabled="loading"
        :class="$style.mb_20"
      />
      <click2pay-remember-me :class="$style.mb_32" />
      <transition name="fade-enter">
        <div v-if="message" :class="$style.message">{{ message }}</div>
      </transition>
      <transition name="fade-enter">
        <div v-if="messageOk" :class="$style.message_ok">{{ messageOk }}</div>
      </transition>
      <f-button-success
        :disabled="disabled"
        :loading="loading"
        :text="$t('check_and_continue')"
        @click="submit"
      />
    </f-form>
    <div :class="$style.or">
      <div :class="$style.or_hr" />
      <div :class="$style.or_text" v-text="$t('or')" />
    </div>
    <f-button
      :class="$style.mb_32"
      block
      size="lg"
      :text="$t('enter_card_details')"
      @click="goCard"
    />
  </f-container>
</template>

<script>
import FContainer from '@/components/base/container'
import Click2payHeader from '@/views/click2pay/header'
import FForm from '@/components/form/form/form'
import FLink from '@/components/link'
import FOtp from '@/components/otp'
import Click2payRememberMe from '@/views/click2pay/remember-me'
import FButtonSuccess from '@/components/button/button-success'
import FButton from '@/components/button/button'
import { timeoutMixin } from '@/mixins/timeout'
import { getCards, initiateIdentityValidation, complete } from '@/click2pay'

export default {
  components: {
    FContainer,
    Click2payHeader,
    FForm,
    FLink,
    FOtp,
    Click2payRememberMe,
    FButtonSuccess,
    FButton,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      count: 6,
      timer: 60,
      second: 0,
      loading: false,
      validationData: '',
      messageOk: '',
      message: '',
      maskedValidationChannel: ',',
    }
  },
  computed: {
    email() {
      return this.maskedValidationChannel.split(',')[0]
    },
    phone() {
      return this.maskedValidationChannel.split(',')[1]
    },
    time() {
      const minutes = Math.floor(this.second / 60)
      const seconds = this.second - minutes * 60
      const minutesFormat = ('0' + minutes).slice(-2)
      const secondsFormat = ('0' + seconds).slice(-2)

      return `${minutesFormat}:${secondsFormat}`
    },
  },
  created() {
    this.second = this.timer
    this.tick()
    this.getMaskedValidationChannel()
  },
  methods: {
    tick() {
      this.second -= 1
      if (!this.second) return

      this.timeout('tick', 1000)
    },
    getMaskedValidationChannel() {
      getCards().then(({ maskedValidationChannel }) => {
        this.maskedValidationChannel = maskedValidationChannel
      })
    },
    resend() {
      this.messageOk = ''
      this.message = ''

      return initiateIdentityValidation().catch(error => {
        this.message = this.$t(error)

        return Promise.reject()
      })
    },
    click() {
      this.second = this.timer
      this.tick()
      this.resend()
        .then(() => {
          this.messageOk = this.$t('code_sent')
        })
        .catch(() => {})
    },
    onSubmit() {
      if (this.loading) return

      this.loading = true
      this.messageOk = ''
      this.message = ''

      complete(this.validationData)
        .finally(() => {
          this.loading = false
          this.validationData = ''
        })
        .then(({ actionCode }) => {
          this.store.setClick2payActionCode(actionCode)

          this.$router.push({ name: 'click2pay' }).catch(() => {})
        })
        .catch(error => {
          this.message = this.$t(error)
        })
    },
    goCard() {
      this.$router.push({ name: 'card' }).catch(() => {})
    },
    goSwitchId() {
      this.$router.push({ name: 'click2pay_switch_id' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.mb_16 {
  margin-bottom: px-to-rem(16px);
}

.h3 {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 600;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #313539;
  }
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.time {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  display: flex;
  justify-content: center;
  margin-bottom: px-to-rem(12px);
}

.resend {
  display: flex;
  justify-content: flex-end;
  margin-bottom: px-to-rem(12px);
}

.mb_20 {
  margin-bottom: px-to-rem(20px);
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}

.message {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.message_ok {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #08a835;
  margin-bottom: px-to-rem(8px);
}

.or {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: px-to-rem(32px);
  margin-bottom: px-to-rem(32px);
}

.or_hr {
  position: absolute;
  height: 1px;
  top: 50%;
  left: 0;
  right: 0;

  :global(.f-theme-light) & {
    background-color: #d5dae0;
  }
}

.or_text {
  position: relative;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  padding: 0 px-to-rem(12px);
  background-color: $container-bg;

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}
</style>
