<template>
  <f-loading v-if="showFirstLoading" backdrop />
  <f-form v-else :class="$uiClass('wrapper')" :data-e2e-ready="ready">
    <f-alert-notification-wrapper />
    <transition name="f-fade-enter">
      <router-view />
    </transition>
    <f-loading
      v-if="showLoading"
      backdrop
      :backdrop-class="$uiClass('backdrop')"
    />
    <f-modal-error-wrapper />
    <f-modal-3ds-wrapper
      ref="modal"
      :duration="duration3ds"
      @submit3ds="submit3ds"
    />
    <f-alert-gdpr-wrapper />
  </f-form>
</template>

<script>
import FForm from '@/components/form/form'
import FModalErrorWrapper from '@/components/modal/modal-error-wrapper'
import FModal3dsWrapper from '@/components/modal/modal-3ds-wrapper'
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
    FModal3dsWrapper,
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
      duration3ds: 0,
      count: 0,
    }
  },
  computed: {
    ...mapState(['loading', 'info']),
    ...mapState('options', ['autosubmit']),
    ...mapState('params', ['token', 'payment_system']),
    ...mapStateGetSet(['ready', 'order']),
    showFirstLoading() {
      return this.autosubmit && !this.ready
    },
    showLoading() {
      return !this.$meta.noLoading && this.loading
    },
  },
  created() {
    this.store.formLoading(true)

    this.store
      .sendRequestApp()
      .then(this.appSuccess)
      .catch(this.appError)
      .catch(errorHandler)
      .finally(() => {
        this.ready = true
      })
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

      if (!this.locationOrder(model.instance(model.attr('order')))) {
        this.locationModel(
          model.instance(model.alt('model', model.serialize()))
        )
      }

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
      if (!this.locationOrder(model.instance(model.attr('order')))) {
        this.store.formLoading(false)
      }
      return Promise.reject(model)
    },
    appSuccess(model) {
      this.$root.$emit('ready', model)
      this.appFinally(model)

      if (model.attr('info.client_fee')) {
        this.store.feeCalc(this.$route.name)
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
      this.store.orderSuccess(model.attr('order'))
      this.store.cardSuccess(model.attr('cards'))

      if (!this.locationOrder(model.instance(model.attr('order')))) {
        this.locationFirst()
      }
    },
    submit3dsSuccess(model) {
      if (!model.waitOn3dsDecline()) return

      this.duration3ds = model.waitOn3dsDecline()
      this.$refs.modal.show()
      model3ds = model
    },
    locationOrder(model) {
      if (!model.attr('order_data')) return false

      this.order = model.serialize()

      if (
        this.$root._events.callback?.length &&
        model.attr('ready_to_submit')
      ) {
        this.store.formLoading(false)
        this.$root.$emit('callback', model)

        return true
      }

      if (this.store.readyToSubmit() && model.submitToMerchant()) return true

      if (model.waitForResponse()) {
        const tab = mappingMethod(model.attr('order_data.payment_system'))
        const method = this.store.getMethodByMethodAlias(
          model.attr('active_method')
        )
        if (method) {
          this.$router
            .push({
              name: 'system',
              params: { method: method.tab, system: method.id },
            })
            .catch(() => {})
        } else if (
          arrayIncludes(configMethods, tab) &&
          this.$meta.method !== tab
        ) {
          this.$router.push({ name: tab }).catch(() => {})
        }
        this.waitForFinalOrderStatus()
        return true
      }

      if (model.needVerifyCode()) {
        this.$router.push({ name: 'verify' }).catch(() => {})
        this.store.formLoading(false)
        return true
      }
      if (model.inProgress()) {
        this.$router.push({ name: 'success' }).catch(() => {})
        this.store.formLoading(false)
        return true
      }

      return false
    },
    locationModel(model) {
      const tab = this.store.getTabByMethodId(this.payment_system)

      if (model.sendResponse()) return true

      this.store.formLoading(false)

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
        return true
      }
      if (model.attr('action') === 'deep_link') {
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
        return true
      } else if (model.attr('action') === 'show_client_fee') {
        this.$router
          .push({
            name: 'client-fee',
            params: {
              method: tab,
              system: this.payment_system,
              data: model.serialize(),
            },
          })
          .catch(() => {})
        return true
      }

      return false
    },
    locationFirst() {
      const autoSubmitParams = this.store.getAutoSubmitParams()
      this.store.formLoading(false)

      if (
        findGetParameter('action') === 'deep_link' &&
        DOMAIN === location.hostname
      ) {
        this.$router
          .push({
            name: 'deep-link',
            params: Object.fromEntries(
              new URL(location.href).searchParams.entries()
            ),
          })
          .catch(() => {})
      } else if (autoSubmitParams) {
        this.formRequest(autoSubmitParams).catch(errorHandler)
      } else {
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
        .then(this.locationOrder)
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

<style lang="scss" module>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: $container_bg;
}

.wrapper_adaptive {
  @include media-breakpoint-up(xl) {
    max-width: 1140px;
    max-height: 686px;
    border-radius: $border-radius-lg;
    box-shadow: 0 24px 40px fade($container_box_shadow, 60%);
  }

  @include media-breakpoint-up(xxl) {
    max-width: 1280px;
  }
}

.backdrop_adaptive {
  @include media-breakpoint-up(xl) {
    border-radius: $border-radius-lg;
  }
}
</style>
