import { createApp } from 'vue'
import { i18n } from '@/i18n'
import { HTMLElement } from '@/utils/safe-types'
import { Tooltip } from '@/components/tooltip/helpers/tooltip'
import { install as installPlugins } from '@/plugins'
import {
  PROP_TYPE_ARRAY_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  props: {
    boundary: makeProp(
      [HTMLElement, PROP_TYPE_OBJECT, PROP_TYPE_STRING],
      'clippingParents'
    ),
    customClass: makeProp(PROP_TYPE_STRING),
    innerClass: makeProp(PROP_TYPE_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    matchTargetWidth: makeProp(PROP_TYPE_BOOLEAN, false),
    noArrow: makeProp(PROP_TYPE_BOOLEAN, false),
    placement: makeProp(PROP_TYPE_STRING, 'top'),
    placementTarget: makeProp(PROP_TYPE_FUNCTION),
    target: makeProp(PROP_TYPE_FUNCTION, undefined, true),
    triggers: makeProp(PROP_TYPE_ARRAY_STRING, 'hover focus'),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  emits: [
    'update:show',
    'show',
    'shown',
    'hide',
    'hidden',
    'update:disabled',
    'disabled',
    'enabled',
    'close',
  ],
  data() {
    return {
      localShow: this.show,
      localContent: () => null,
    }
  },
  computed: {
    templateData() {
      return {
        content: this.localContent,
        placementTarget: this.placementTarget,
        target: this.target,
        triggers: this.triggers,
        placement: this.placement,
        customClass: this.customClass,
        innerClass: this.innerClass,
        boundary: this.boundary,
        matchTargetWidth: this.matchTargetWidth,
        noArrow: this.noArrow,
        disabled: this.disabled,
      }
    },
  },
  watch: {
    show(show, oldVal) {
      if (show !== oldVal && show !== this.localShow && this.$_tooltip) {
        if (show) {
          this.$_tooltip.show()
        } else {
          // We use `forceHide()` to override any active triggers
          this.$_tooltip.forceHide()
        }
      }
    },
    disabled(newVal) {
      if (newVal) {
        this.disable()
      } else {
        this.enable()
      }
    },
    localShow(newVal) {
      this.$emit('update:show', newVal)
    },
    templateData() {
      this.$nextTick(() => {
        if (this.$_tooltip) {
          this.$_tooltip.updateData(this.templateData)
        }
      })
    },
  },
  created() {
    this.$_tooltip = null
    this.$_tooltipApp = null
  },
  updated() {
    this.$nextTick(this.updateContent)
  },
  beforeUnmount() {
    if (this.$_tooltip) {
      this.$_tooltipApp?.unmount()
      this.$_tooltip = null
      this.$_tooltipApp = null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateContent()
      const app = createApp(Tooltip, {
        onShow: this.onShow,
        onShown: this.onShown,
        onHide: this.onHide,
        onHidden: this.onHidden,
        onDisabled: this.onDisabled,
        onEnabled: this.onEnabled,
      })

      app.use(i18n)
      app.use(installPlugins(this.$emitter))
      app.config.globalProperties.store = this.store

      this.$_tooltipApp = app
      this.$_tooltip = app.mount(document.createElement('div'))
      const $toolpop = this.$_tooltip
      $toolpop.updateData(this.templateData)

      if (this.disabled) {
        this.disable()
      }
      if (this.localShow) {
        $toolpop.show()
      }
    })
  },
  methods: {
    open() {
      this.$_tooltip?.show()
    },
    close() {
      this.$_tooltip?.forceHide()
    },
    enable() {
      this.$_tooltip?.enable()
    },
    disable() {
      this.$_tooltip?.disable()
    },
    updateContent() {
      const val = this.$slots.default
      if (this.localContent !== val) {
        this.localContent = val
      }
    },
    // --- Template event handlers ---
    onShow(fEvt) {
      this.$emit('show', fEvt)
      if (fEvt) {
        this.localShow = !fEvt.defaultPrevented
      }
    },
    onShown(fEvt) {
      this.localShow = true
      this.$emit('shown', fEvt)
    },
    onHide(fEvt) {
      this.$emit('hide', fEvt)
    },
    onHidden(fEvt) {
      this.$emit('hidden', fEvt)
      this.localShow = false
    },
    onDisabled(fEvt) {
      if (fEvt && fEvt.type === 'disabled') {
        this.$emit('update:disabled', true)
        this.$emit('disabled', fEvt)
      }
    },
    onEnabled(fEvt) {
      if (fEvt && fEvt.type === 'enabled') {
        this.$emit('update:disabled', false)
        this.$emit('enabled', fEvt)
      }
    },
  },
  render() {
    return null
  },
}
