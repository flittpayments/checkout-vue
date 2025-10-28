<template>
  <div>
    <div :class="$uiClass('title')">{{ title }}</div>
    <f-qr-code :class="$uiClass('qr')" :url="url" :query-params="queryParams" />
    <div v-if="params.web_banking_enabled" :class="$style.link">
      <!--$t('follow_link_to_complete_payment_in_web_banking')-->
      <i18n path="follow_link_to_complete_payment_in_web_banking">
        <template #link>
          <a
            v-if="target === '_blank'"
            :href="data.deeplink"
            target="_blank"
            @click="clickNonBlocking"
            >{{ $t('link') }}</a
          >
          <a v-else href="#" @click.prevent="click">{{ $t('link') }}</a>
        </template>
      </i18n>
    </div>
    <div v-if="showDesc" :class="$style.desc">
      <div v-if="showLimit" :class="$style.item">
        <div :class="$uiClass('name')"><span v-text="$t('limit')" />:</div>
        <div :class="$uiClass('value')">
          <f-amount :value="installments.min_limit" />
          –
          <f-amount :value="installments.max_limit" />
          {{ installments.currency }}
        </div>
      </div>
      <div v-if="installments.number_of_payments" :class="$style.item">
        <div :class="$uiClass('name')">
          <span v-text="$t('number_of_payments')" />:
        </div>
        <div :class="$uiClass('value')">
          {{ installments.number_of_payments }}
        </div>
      </div>
      <div v-if="installments.intereset_rate" :class="$style.item">
        <div :class="$uiClass('name')">
          <span v-text="$t('interest_rate')" />:
        </div>
        <div :class="$uiClass('value')">
          <f-percent :value="installments.intereset_rate" />
        </div>
      </div>
      <div v-if="installments.effective_rate" :class="$style.item">
        <div :class="$uiClass('name')">
          <span v-text="$t('effective_interest_rate')" />:
        </div>
        <div :class="$uiClass('value')">
          <f-percent :value="installments.effective_rate" />
        </div>
      </div>
    </div>
    <div
      v-if="params.terms_url"
      :class="$uiClass('terms')"
      v-html="$t('agree_to_terms', { terms, name: info.name })"
    />
    <div v-if="showApps" :class="$uiClass('apps')">
      <div :class="$uiClass('apps_col')">
        <div
          :class="$uiClass('apps_title')"
          v-text="$t('no_mobile_app', { name: info.name })"
        />
        <div
          :class="$uiClass('apps_desc')"
          v-text="$t('download_to_scan_qr')"
        />
      </div>
      <div :class="[$uiClass('apps_col'), $style.row]">
        <div :class="$uiClass('app')">
          <f-qr-code :class="$uiClass('app_qr')" :url="params.apple_app_url" />
          <a
            :class="$style.app_btn"
            :href="params.apple_app_url"
            target="_blank"
          >
            <svg-app-store />
          </a>
        </div>
        <div :class="$uiClass('app')">
          <f-qr-code :class="$uiClass('app_qr')" :url="params.google_app_url" />
          <a
            :class="$style.app_btn"
            :href="params.google_app_url"
            target="_blank"
          >
            <svg-google-play />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FQrCode from '@/components/qr-code'
import FAmount from '@/components/base/amount'
import FPercent from '@/components/base/percent'
import SvgAppStore from '@/svg/app-store.svg'
import SvgGooglePlay from '@/svg/google-play.svg'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { timeoutMixin } from '@/mixins/timeout'
import { mapState } from '@/utils/store'
import { errorHandler, fib } from '@/utils/helpers'
import { appendQueryParams } from '@/utils/url'

export default {
  components: {
    FQrCode,
    FAmount,
    FPercent,
    SvgAppStore,
    SvgGooglePlay,
  },
  mixins: [timeoutMixin],
  inject: ['cancelWaitForFinalOrderStatus', 'waitForFinalOrderStatus'],
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
    data: makeProp(PROP_TYPE_OBJECT), // deeplink deepcallback checkout_url
  },
  data() {
    return {
      count: 0,
      loading: false,
    }
  },
  computed: {
    ...mapState(['tabs']),
    ...mapState('options', ['api_domain']),
    ...mapState('params', ['token', 'payment_system']),
    info() {
      return this.tabs[this.method][this.system]
    },
    params() {
      return this.info.params || {}
    },
    installments() {
      return this.params.installments || {}
    },
    target() {
      return this.params.web_banking_target
    },
    title() {
      // $t('scan_to_pay_banks')
      // $t('scan_to_pay_installments')
      return this.params.app_name
        ? this.$t('scan_to_pay_app', { app_name: this.appName })
        : this.$t(`scan_to_pay_${this.method}`)
    },
    appName() {
      // $t('Liberty Bank Mobile Banking')
      // $t('Credo Bank Mobile Banking')
      // $t('Bank of Georgia Mobile Banking')
      // $t('TBC Bank Mobile Banking')
      // $t('PayMe Mobile application')
      return this.$t(this.params.app_name)
    },
    url() {
      return appendQueryParams(this.data.checkout_url, {
        autosubmit: true,
        action: 'deep_link',
        method: this.method,
        system: this.system,
        link: this.data.deeplink,
        callback: this.data.deepcallback,
      })
    },
    queryParams() {
      return this.params.shortener_with_deeplink_in_get
        ? { link: this.data.deeplink }
        : {}
    },
    showDesc() {
      return (
        this.showLimit ||
        this.installments.number_of_payments ||
        this.installments.intereset_rate ||
        this.installments.effective_rate
      )
    },
    showLimit() {
      return (
        this.installments.min_limit &&
        this.installments.max_limit &&
        this.installments.currency
      )
    },
    terms() {
      return `<a href="${this.termsUrl}" target="_blank">${this.$t(
        'terms'
      )}</a>`
    },
    termsUrl() {
      // $t('https://accounts.libertybank.ge/files/UA-en.pdf')
      // $t('https://credobank.ge/en/conditions')
      // $t('https://conditions.bog.ge/en/main')
      // $t('https://tbcbank.ge/en/digital-channel-terms')
      // $t('https://cdn.payme.uz/terms/en/privacy_policy.htm')
      return this.$t(this.params.terms_url)
    },
    showApps() {
      return this.params.apple_app_url || this.params.google_app_url
    },
  },
  created() {
    this.request()
    this.timeout('getOrderClear', 15 * 60 * 1000)
  },
  methods: {
    request() {
      this.count++
      this.timeout('getOrder', fib(this.count) * 1000)
    },
    getOrder() {
      this.store
        .sendRequest('api.checkout.order', 'get', {
          token: this.token,
        })
        .then(this.success)
        .catch(errorHandler)
    },
    getOrderClear() {
      this.clearTimeout('getOrder')
      this.clearTimeout('getOrderClear')
    },
    success(model) {
      if (model.attr('cloudfront-is-mobile-viewer')) {
        this.goLoading()
      } else if (model.attr('pending')) {
        this.cancelWaitForFinalOrderStatus()
        this.waitForFinalOrderStatus()
      } else {
        this.request()
      }
    },
    clickNonBlocking() {
      this.timeout(() => {
        this.sendCallback()
        this.goLoading()
      })
    },
    click() {
      if (this.loading) return
      this.loading = true

      this.sendCallback()
        .then(() => {
          location.assign(this.data.deeplink)
        })
        .catch(errorHandler)
        .finally(() => {
          this.loading = false
        })
    },
    sendCallback() {
      return this.store.sendRequestBase('api.checkout.deepcallback', 'get', {
        url: this.data.deepcallback,
      })
    },
    goLoading() {
      this.$router
        .push({
          name: 'loading',
          params: { method: this.method, system: this.system },
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-size: px-to-rem(18px);
  line-height: px-to-rem(26px);
  font-weight: 500;
  text-align: center;
  margin-bottom: px-to-rem(16px);
}

.title_light {
  color: #3d3d3d;
}

.title_dark {
  color: #fff;
}

.qr {
  width: px-to-rem(226px);
  height: px-to-rem(226px);
  margin: px-to-rem(16px) auto;
  border-radius: $border-radius;
  overflow: hidden;
  background: #fff;
}

.qr_light {
  padding: px-to-rem(12px);
  border: px-to-rem(5px) solid #e6e6ea;
}

.qr_dark {
  padding: px-to-rem(16px);
}

.link {
  text-align: center;
}

.desc {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: px-to-rem(12px);
  column-gap: px-to-rem(8px);
  margin-top: px-to-rem(8px);
}

.item {
  display: flex;
  gap: px-to-rem(4px);
}

.name {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(18px);
  font-weight: 400;
}

.name_light {
  color: #6b7280;
}

.value {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(18px);
  font-weight: 500;
}

.value_light {
  color: #020203;
}

.terms {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(18px);
  font-weight: 400;
  margin-top: px-to-rem(8px);
  text-align: center;
}

.terms_light {
  color: #6b7280;
}

.terms_dark {
  color: #aeaeae;
}

.apps {
  display: flex;
  flex-wrap: wrap;
  margin-top: px-to-rem(24px);
  border-radius: $border-radius-lg;
  padding: px-to-rem(12px);
  align-items: center;
}

.apps_light {
  background: #e5e8eb;
}

.apps_dark {
  background: #44484c;
}

.apps_adaptive {
  @include breakpoints.up(md) {
    padding: px-to-rem(12px) px-to-rem(12px) px-to-rem(12px) px-to-rem(16px);
  }
}

.apps_col {
  width: 100%;
}

.apps_col_adaptive {
  @include breakpoints.up(md) {
    width: 50%;
  }
}

.apps_title {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 600;
}

.apps_title_light {
  color: #5a6470;
}

.apps_title_dark {
  color: #eff0f5;
}

.apps_desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(16px);
}

.apps_desc_light {
  color: #5a6470;
}

.apps_desc_dark {
  color: #eff0f5;
}

.apps_desc_adaptive {
  @include breakpoints.up(md) {
    margin-bottom: 0;
  }
}

.row {
  display: flex;
  gap: px-to-rem(12px);
  max-height: px-to-rem(96px);
}

.app {
  display: flex;
  gap: px-to-rem(4px);
  align-items: center;
  text-align: center;
  flex: 1;
  background: #fff;
  padding: px-to-rem(4px);
  border-radius: $border-radius-sm;
}

.app_adaptive {
  @include breakpoints.up(md) {
    padding: px-to-rem(8px);
    gap: px-to-rem(12px);
  }
}

.app_qr {
  flex: 1;
}

.app_btn {
  flex: 2;
}

.app_btn svg {
  max-height: px-to-rem(56px);
}
</style>
