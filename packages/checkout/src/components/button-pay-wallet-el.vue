<template>
  <div />
</template>

<script>
import { createApp } from 'vue'
import { i18n } from '@/i18n'
import ButtonPayWalletList from '@/components/button-pay-wallet-list'
import { mapState, mapStateGetSet } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { install as installPlugins } from '@/plugins'

export default {
  inject: ['formRequest', 'validate'],
  inheritAttrs: false,
  props: {
    noAppend: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapStateGetSet(['vm_wallets']),
    ...mapState('options', [
      'disable_request',
      'wallet_methods_enabled',
      'methods_disabled',
    ]),
    show() {
      return (
        !this.disable_request &&
        this.wallet_methods_enabled.length &&
        !this.methods_disabled.includes('wallets')
      )
    },
  },
  watch: {
    noAppend: 'append',
  },
  created() {
    this.init()
  },
  mounted() {
    this.append()
  },
  methods: {
    init() {
      if (!this.show) return
      if (this.vm_wallets) return

      const app = createApp(ButtonPayWalletList, this.$attrs)

      app.use(i18n)
      app.use(installPlugins(this.$emitter))
      app.config.globalProperties.store = this.store
      app.provide('formRequest', this.formRequest)
      app.provide('validate', this.validate)
      this.vm_wallets = app.mount(document.createElement('div'))
    },
    append() {
      if (this.noAppend) return
      if (!this.show) return
      this.vm_wallets.className = this.$attrs.classname
      this.vm_wallets.load = false
      this.$el.appendChild(this.vm_wallets.$el)
    },
  },
}
</script>
