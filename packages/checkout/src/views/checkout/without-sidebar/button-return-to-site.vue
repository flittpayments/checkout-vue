<template>
  <div :class="$style.wrapper">
    <f-button-default
      :text="$t('return_to_site')"
      size="lg"
      block
      :disabled="loading"
      data-e2e-button-return-to-site
      @click="click"
    />
    <!--$t('will_be_redirected_to_merchant_site')-->
    <i18n
      v-if="seconds"
      path="will_be_redirected_to_merchant_site"
      tag="div"
      :class="$style.message"
    >
      <template #seconds>
        <b>{{ seconds }}</b>
      </template>
    </i18n>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FButtonDefault from '@/components/button/button-default'
import { errorHandler } from '@/utils/helpers'
import { timeoutMixin } from '@/mixins/timeout'

export default {
  components: {
    FButtonDefault,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      loading: false,
      seconds: 11,
    }
  },
  computed: {
    ...mapState('params', ['token']),
  },
  created() {
    this.tick()
  },
  methods: {
    tick() {
      this.seconds -= 1

      if (this.seconds) {
        this.timeout('tick', 1000)
      } else {
        this.click()
      }
    },
    click() {
      if (this.loading) return
      this.loading = true

      this.store
        .sendRequest('api.checkout.order', 'get', {
          token: this.token,
        })
        .then(model => {
          model.submitToMerchant()
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
  margin-top: px-to-rem(32px);
}

.message {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  margin-top: px-to-rem(16px);
}
</style>
