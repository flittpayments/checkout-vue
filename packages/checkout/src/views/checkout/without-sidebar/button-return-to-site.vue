<template>
  <div :class="$style.wrapper">
    <f-button
      variant="default"
      :text="$t('return_to_site')"
      size="lg"
      block
      :disabled="loading"
      data-e2e-button-return-to-site
      @click="click"
    />
    <div
      v-if="second"
      :class="$style.second"
      v-html="$t('will_be_redirected_to_merchant_site', [second])"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FButton from '@/components/button/button'
import { errorHandler } from '@/utils/helpers'
import { timeoutMixin } from '@/mixins/timeout'

export default {
  components: {
    FButton,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      loading: false,
      second: 11,
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
      this.second -= 1

      if (this.second) {
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

.second {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  margin-top: px-to-rem(16px);
}
</style>
