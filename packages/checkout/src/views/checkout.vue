<template>
  <f-loading v-if="showFirstLoading" backdrop />
  <f-form
    v-else
    class="f-container"
    :class="classNameContainer"
    :data-e2e-ready="ready"
  >
    <f-alert-notification-wrapper />
    <transition name="f-fade-enter">
      <router-view class="f-layout" />
    </transition>
    <f-loading v-if="showLoading" backdrop />
    <f-modal-error-wrapper />
    <f-modal-3ds
      v-model="show3ds"
      :duration.sync="duration3ds"
      @submit3ds="submit3ds"
    />
    <f-alert-gdpr-wrapper />
  </f-form>
</template>

<script>
import FForm from '@/components/form/form'
import FModalErrorWrapper from '@/components/modal/modal-error-wrapper'
import FModal3ds from '@/components/modal/modal-3ds'
import FAlertGdprWrapper from '@/components/alert/alert-gdpr-wrapper'
import FAlertNotificationWrapper from '@/components/alert/alert-notification-wrapper'
import { errorHandler, findGetParameter } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isError } from '@/utils/inspect'
import { fib } from '@/utils/helpers'
import { FLoading } from '@/import'
import configMethods from '@/config/methods.json'
import { arrayIncludes } from '@/utils/array'
import { mappingMethod } from '@/config/mapping-method'

let model3ds

export default {
  components: {
    FForm,
    FLoading,
    FModalErrorWrapper,
    FModal3ds,
    FAlertGdprWrapper,
    FAlertNotificationWrapper,
  },
  mixins: [timeoutMixin, resizeMixin],
  provide() {
    return {
      formRequest: this.formRequest,
      cancelWaitForFinalOrderStatus: this.cancelWaitForFinalOrderStatus,
      waitForFinalOrderStatus: this.waitForFinalOrderStatus,
    }
  },
  data() {
    return {
      timeoutId: 0,
      show3ds: false,
      duration3ds: 0,
      count: 0,
    }
  },
  computed: {
    ...mapState('options.theme', ['type']),
    ...mapState(['loading', 'info']),
    ...mapState('options', ['autosubmit']),
    ...mapState('params', ['token', 'fee', 'payment_system']),

    ...mapStateGetSet(['ready', 'order']),
    ...mapStateGetSet('params', [
      'amount',
      'currency',
      'merchant_id',
      'order_id',
      'verification_type',
    ]),
    showFirstLoading() {
      return this.autosubmit && !this.ready
    },
    showLoading() {
      return !this.$route.meta.noLoading && this.loading
    },
    classNameContainer() {
      return [`f-page-${this.$route.name}`, `f-theme-${this.type}`]
    },
  },
  created() {
    this.store.formLoading(true)

    this.store
      .sendRequestApp()
      .then(this.appSuccess)
      .finally(() => {
        this.ready = true
      })
      .catch(this.appError)
      .catch(errorHandler)
  },
  methods: {
    formRequest(data) {
      if (this.loading) return Promise.reject()
      this.store.formLoading(true)

      return this.store
        .sendRequest(
          'api.checkout.form',
          'request',
          data,
          {},
          this.submitProgress
        )
        .then(this.submitSuccess, this.submitError)
        .catch(errorHandler)
    },
    submitProgress(model) {
      if (!model) return

      this.location(model.instance(model.alt('order', model.data)))
      this.submit3dsSuccess(model)

      return model
    },
    submitSuccess(model) {
      this.$root.$emit('success', model)
      this.store.setToken(model.attr('token'))
      this.submitProgress(model)

      return model
    },
    submitError(model) {
      this.$root.$emit('error', model)
      this.store.setToken(model.attr('token'))
      this.location(model.instance(model.attr('order')))
      return Promise.reject(model)
    },
    appSuccess(model) {
      this.$root.$emit('ready', model)
      this.appFinally(model)

      if (this.fee) {
        this.store.feeCalc()
      }
    },
    appError(model) {
      this.$root.$emit('error', model)
      if (!isError(model)) {
        this.appFinally(model)
      }

      return Promise.reject(model)
    },
    appFinally(model) {
      if (!model) return

      this.store.paySuccess(model.attr('pay'))
      this.store.infoSuccess(model.instance(model.attr('info')))
      this.orderSuccess(model.instance(model.attr('order')))
      this.store.cardSuccess(model.attr('cards'))
    },
    orderSuccess(model) {
      this.location(model)

      let order_data = model.attr('order_data')

      if (!order_data) return

      this.amount = parseInt(order_data.amount, 10)
      this.store.initTotalAmount()
      this.currency = order_data.currency
      this.merchant_id = order_data.merchant_id
      this.store.state.params.email =
        order_data.sender_email || this.store.state.params.email
      this.order_id = order_data.order_id
      this.verification_type = model.data.verification_type
    },
    submit3dsSuccess(model) {
      if (!model.waitOn3dsDecline()) return

      this.show3ds = true
      this.duration3ds = model.waitOn3dsDecline()
      model3ds = model
    },
    location(model) {
      this.order = model.data

      if (model.sendResponse()) return

      if (
        this.$root._events.callback?.length &&
        model.attr('ready_to_submit')
      ) {
        this.store.formLoading(false)
        this.$root.$emit('callback', model)

        return
      }

      if (this.store.readyToSubmit() && model.submitToMerchant()) return

      if (model.waitForResponse()) {
        let method = mappingMethod(model.attr('order_data.payment_system'))
        if (
          arrayIncludes(configMethods, method) &&
          this.$route.meta.method !== method
        ) {
          this.$router.push({ name: method }).catch(() => {})
        }
        this.waitForFinalOrderStatus()
        return
      }

      this.store.formLoading(false)

      const tab = this.store.getTabByMethodId(this.payment_system)
      const autoSubmitParams = this.store.getAutoSubmitParams()

      if (model.attr('action') === 'qr_code') {
        this.$router
          .push({
            name: 'qr-code',
            params: {
              method: tab,
              system: this.payment_system,
              data: model.attr('send_data'),
            },
          })
          .catch(() => {})
      } else if (model.attr('action') === 'deep_link') {
        this.$router
          .push({
            name: 'deep-link',
            params: {
              method: tab,
              system: this.payment_system,
              link: model.attr('send_data.deeplink'),
              callback: model.attr('send_data.deepcallback'),
            },
          })
          .catch(() => {})
      } else if (model.needVerifyCode()) {
        this.$router.push({ name: 'verify' }).catch(() => {})
      } else if (model.inProgress()) {
        this.store.hideError()
        this.$router.push({ name: 'success' }).catch(() => {})
      } else if (
        !this.flag &&
        findGetParameter('action') === 'deep_link' &&
        DOMAIN === location.hostname
      ) {
        this.flag = true
        this.$router
          .push({
            name: 'deep-link',
            params: Object.fromEntries(
              new URL(location.href).searchParams.entries()
            ),
          })
          .catch(() => {})
      } else if (!this.flag && autoSubmitParams) {
        this.flag = true
        this.formRequest(autoSubmitParams).catch(errorHandler)
      } else if (!this.flag) {
        this.flag = true
        this.$router
          .push(this.store.location(this.isBreakpointDownLg))
          .catch(() => {})
      }
    },
    waitForFinalOrderStatus() {
      this.store.formLoading(true)
      this.count++
      this.timeout('getOrder', fib(this.count) * 1000)
      this.timeout('cancelWaitForFinalOrderStatus', 4 * 60 * 1000, false)
    },
    getOrder() {
      this.store
        .sendRequest('api.checkout.order', 'get', {
          token: this.token,
        })
        .then(this.orderSuccess)
        .catch(errorHandler)
    },
    cancelWaitForFinalOrderStatus() {
      this.count = 0
      this.clearTimeout('getOrder')
      this.clearTimeout('cancelWaitForFinalOrderStatus')
    },
    submit3ds() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
