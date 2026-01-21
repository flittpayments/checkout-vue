// Tooltip "Class" (Built as a renderless Vue instance)
//
// Handles trigger events, etc.
// Instantiates template on demand

import { createApp } from 'vue'
import { i18n } from '@/i18n'
import { EVENT_OPTIONS_NO_CAPTURE } from '@/constants/events'
import { looseEqual } from '@/utils/loose-equal'
import { noop } from '@/utils/noop'
import { arrayIncludes, concat, from as arrayFrom } from '@/utils/array'
import {
  attemptFocus,
  closest,
  contains,
  getAttr,
  getById,
  isDisabled,
  isVisible,
  removeAttr,
  setAttr,
} from '@/utils/dom'
import { eventOn, eventOff, eventOnOff } from '@/utils/events'
import { isUndefined } from '@/utils/inspect'
import { keys } from '@/utils/object'
import { FEvent } from '@/utils/event.class'
import TooltipTemplate from '@/components/tooltip/helpers/tooltip-template'
import { install as installPlugins } from '@/plugins'

// Modal container selector for appending tooltip
const MODAL_SELECTOR = '.f-modal-content'
// Modal `$emitter` hidden event
const MODAL_CLOSE_EVENT = 'modal::hidden'

// For dropdown sniffing

// Data specific to popper and template
// We don't use props, as we need reactivity (we can't pass reactive props)
const templateData = {
  // Scoped slot function
  content: null,
  // String, Array, Object
  customClass: null,
  innerClass: null,
  // String or array of Strings (overwritten by Popper)
  triggers: '',
  // String (overwritten by Popper)
  placement: 'auto',
  placementTarget: null,
  // Element or Component reference (or function that returns element) of
  // the element that will have the trigger events bound, and is also
  // default element for positioning
  target: null,
  matchTargetWidth: null,
  noArrow: false,
  // 'clippingParents', 'viewport', 'window', Element, or Component reference
  boundary: 'clippingParents',
  // Disabled state (Boolean)
  disabled: false,
}

export const Tooltip = {
  name: 'Tooltip',
  data() {
    return {
      ...templateData,
      activeTrigger: {
        hover: false,
        click: false,
        focus: false,
      },
      localShow: false,
    }
  },
  computed: {
    computedId() {
      return `__f_tooltip_${this._.uid}__`
    },
    computedDelay() {
      return { show: 50, hide: 50 }
    },
    computedTriggers() {
      return concat(this.triggers)
        .filter(Boolean)
        .join(' ')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .sort()
    },
    isWithActiveTrigger() {
      for (const trigger in this.activeTrigger) {
        if (this.activeTrigger[trigger]) {
          return true
        }
      }
      return false
    },
    computedTemplateData() {
      return {
        content: this.content,
        customClass: this.customClass,
        innerClass: this.innerClass,
      }
    },
  },
  watch: {
    computedTriggers(newTriggers, oldTriggers) {
      if (!looseEqual(newTriggers, oldTriggers)) {
        this.$nextTick(() => {
          this.unListen()
          oldTriggers.forEach(trigger => {
            if (!arrayIncludes(newTriggers, trigger)) {
              if (this.activeTrigger[trigger]) {
                this.activeTrigger[trigger] = false
              }
            }
          })
          this.listen()
        })
      }
    },
    computedTemplateData() {
      this.handleTemplateUpdate()
    },
    disabled(newValue) {
      if (newValue) {
        this.disable()
      } else {
        this.enable()
      }
    },
  },
  created() {
    this.$_tip = null
    this.$_tipApp = null
    this.$_hoverTimeout = null
    this.$_hoverState = ''
    this.$_visibleInterval = null
    this.$_enabled = !this.disabled
    this.$_noop = noop.bind(this)

    this.$nextTick(() => {
      const target = this.getTarget()
      if (target && contains(document.body, target)) {
        this.listen()
      }
    })
  },
  updated() {
    this.$nextTick(this.handleTemplateUpdate)
  },
  deactivated() {
    this.forceHide()
  },
  beforeUnmount() {
    this.unListen()
    this.setWhileOpenListeners(false)
    this.clearHoverTimeout()
    this.clearVisibilityInterval()
    this.destroyTemplate()
    this.$_noop = null
  },
  methods: {
    updateData(data = {}) {
      keys(templateData).forEach(prop => {
        if (!isUndefined(data[prop]) && this[prop] !== data[prop]) {
          this[prop] = data[prop]
        }
      })
    },
    createTemplateAndShow() {
      const app = createApp(TooltipTemplate, {
        id: this.computedId,
        placement: this.placement,
        target: this.getPlacementTarget(),
        boundary: this.getBoundary(),
        matchTargetWidth: this.matchTargetWidth,
        noArrow: this.noArrow,
        onShow: this.onTemplateShow,
        onShown: this.onTemplateShown,
        onHide: this.onTemplateHide,
        onHidden: this.onTemplateHidden,
        onFocusin: this.handleEvent,
        onFocusout: this.handleEvent,
        onMouseenter: this.handleEvent,
        onMouseleave: this.handleEvent,
      })

      app.use(i18n)
      app.use(installPlugins(this.$emitter))
      app.config.globalProperties.store = this.store

      this.$_tipApp = app
      this.$_tip = app.mount(
        getById('f').appendChild(document.createElement('div'))
      )

      this.handleTemplateUpdate()
    },
    hideTemplate() {
      this.$_tip && this.$_tip.hide()
      this.clearActiveTriggers()
      this.$_hoverState = ''
    },
    destroyTemplate() {
      this.setWhileOpenListeners(false)
      this.clearHoverTimeout()
      this.$_hoverState = ''
      this.clearActiveTriggers()

      if (this.$_tip) {
        this.$_tipApp?.unmount()
        this.$_tip = null
        this.$_tipApp = null
      }
      this.removeAriaDescribedby()
      this.localShow = false
    },
    getTemplateElement() {
      return this.$_tip ? this.$_tip.$el : null
    },
    handleTemplateUpdate() {
      const $tip = this.$_tip
      if ($tip) {
        const props = ['content', 'customClass', 'innerClass']
        props.forEach(prop => {
          if ($tip[prop] !== this[prop]) {
            $tip[prop] = this[prop]
          }
        })
      }
    },
    show() {
      const target = this.getTarget()
      if (
        !target ||
        !contains(document.body, target) ||
        !isVisible(target) ||
        !this.content
      ) {
        return
      }
      if (this.$_tip || this.localShow) {
        return
      }
      this.localShow = true
      const showEvt = this.buildEvent('show', { cancelable: true })
      this.emitEvent(showEvt)
      /* istanbul ignore if */
      if (showEvt.defaultPrevented) {
        this.destroyTemplate()
        return
      }
      this.addAriaDescribedby()
      this.createTemplateAndShow()
    },
    hide(force = false) {
      const tip = this.getTemplateElement()
      /* istanbul ignore if */
      if (!tip || !this.localShow) {
        return
      }

      const hideEvt = this.buildEvent('hide', { cancelable: !force })
      this.emitEvent(hideEvt)
      /* istanbul ignore if: ignore for now */
      if (hideEvt.defaultPrevented) {
        return
      }

      this.hideTemplate()
    },
    forceHide() {
      const tip = this.getTemplateElement()
      if (!tip || !this.localShow) {
        return
      }
      this.setWhileOpenListeners(false)
      this.clearHoverTimeout()
      this.$_hoverState = ''
      this.clearActiveTriggers()
      if (this.$_tip) {
        this.$_tip.noFade = true
      }
      this.hide(true)
    },
    enable() {
      this.$_enabled = true
      this.emitEvent(this.buildEvent('enabled'))
    },
    disable() {
      this.$_enabled = false
      this.emitEvent(this.buildEvent('disabled'))
    },
    onTemplateShow() {
      this.setWhileOpenListeners(true)
    },
    onTemplateShown() {
      const prevHoverState = this.$_hoverState
      this.$_hoverState = ''
      if (prevHoverState === 'out') {
        this.leave(null)
      }
      this.emitEvent(this.buildEvent('shown'))
    },
    onTemplateHide() {
      this.setWhileOpenListeners(false)
    },
    onTemplateHidden() {
      this.destroyTemplate()
      this.emitEvent(this.buildEvent('hidden'))
    },
    // --- Utility methods ---
    getTarget() {
      return this.target()
    },
    getPlacementTarget() {
      return this.placementTarget?.() || this.getTarget()
    },
    getBoundary() {
      return this.boundary
        ? this.boundary.$el || this.boundary
        : 'clippingParents'
    },
    isInModal() {
      const target = this.getTarget()
      return target && closest(MODAL_SELECTOR, target)
    },
    clearHoverTimeout() {
      clearTimeout(this.$_hoverTimeout)
      this.$_hoverTimeout = null
    },
    clearVisibilityInterval() {
      clearInterval(this.$_visibleInterval)
      this.$_visibleInterval = null
    },
    clearActiveTriggers() {
      for (const trigger in this.activeTrigger) {
        this.activeTrigger[trigger] = false
      }
    },
    addAriaDescribedby() {
      const target = this.getTarget()
      let desc = getAttr(target, 'aria-describedby') || ''
      desc = desc.split(/\s+/).concat(this.computedId).join(' ').trim()
      setAttr(target, 'aria-describedby', desc)
    },
    removeAriaDescribedby() {
      const target = this.getTarget()
      let desc = getAttr(target, 'aria-describedby') || ''
      desc = desc
        .split(/\s+/)
        .filter(d => d !== this.computedId)
        .join(' ')
        .trim()
      if (desc) {
        setAttr(target, 'aria-describedby', desc)
      } else {
        removeAttr(target, 'aria-describedby')
      }
    },
    buildEvent(type, options = {}) {
      return new FEvent(type, {
        cancelable: false,
        target: this.getTarget(),
        relatedTarget: this.getTemplateElement() || null,
        componentId: this.computedId,
        vueTarget: this,
        ...options,
      })
    },
    emitEvent(fEvt) {
      const evtName = fEvt.type
      this.$emit(evtName, fEvt)
    },
    listen() {
      const el = this.getTarget()
      if (!el) {
        return
      }
      this.computedTriggers.forEach(trigger => {
        if (trigger === 'click') {
          eventOn(el, 'click', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'clickout') {
          eventOn(
            document,
            'click',
            this.clickOutHandler,
            EVENT_OPTIONS_NO_CAPTURE
          )
        } else if (trigger === 'focus') {
          eventOn(el, 'focusin', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
          eventOn(el, 'focusout', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'blur') {
          eventOn(el, 'focusout', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'hover') {
          eventOn(el, 'mouseenter', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
          eventOn(el, 'mouseleave', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        }
      }, this)
    },
    unListen() {
      const events = [
        'click',
        'focusin',
        'focusout',
        'mouseenter',
        'mouseleave',
      ]
      const target = this.getTarget()

      events.forEach(evt => {
        target &&
          eventOff(target, evt, this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
      }, this)

      eventOff(
        document,
        'click',
        this.clickOutHandler,
        EVENT_OPTIONS_NO_CAPTURE
      )
    },
    clickOutHandler({ target }) {
      if (!this.localShow || contains(this.getTemplateElement(), target)) return

      this.hide()
    },
    setWhileOpenListeners(on) {
      this.setModalListener(on)
      this.visibleCheck(on)
      this.setOnTouchStartListener(on)
    },
    visibleCheck(on) {
      this.clearVisibilityInterval()
      const target = this.getTarget()
      const tip = this.getTemplateElement()
      if (on) {
        this.$_visibleInterval = setInterval(() => {
          if (
            tip &&
            this.localShow &&
            (!target.parentNode || !isVisible(target))
          ) {
            this.forceHide()
          }
        }, 100)
      }
    },
    setModalListener(on) {
      if (this.isInModal()) {
        this.$emitter[on ? 'on' : 'off'](MODAL_CLOSE_EVENT, this.forceHide)
      }
    },
    setOnTouchStartListener(on) {
      if ('ontouchstart' in document.documentElement) {
        arrayFrom(document.body.children).forEach(el => {
          eventOnOff(on, el, 'mouseover', this.$_noop)
        })
      }
    },
    handleEvent(evt) {
      const target = this.getTarget()
      if (!target || isDisabled(target) || !this.$_enabled) {
        return
      }
      const { type } = evt
      const triggers = this.computedTriggers

      if (type === 'click' && arrayIncludes(triggers, 'click')) {
        this.click(evt)
      } else if (type === 'mouseenter' && arrayIncludes(triggers, 'hover')) {
        this.enter(evt)
      } else if (type === 'focusin' && arrayIncludes(triggers, 'focus')) {
        this.enter(evt)
      } else if (
        (type === 'focusout' &&
          (arrayIncludes(triggers, 'focus') ||
            arrayIncludes(triggers, 'blur'))) ||
        (type === 'mouseleave' && arrayIncludes(triggers, 'hover'))
      ) {
        const tip = this.getTemplateElement()
        const evtTarget = evt.target
        const relatedTarget = evt.relatedTarget
        if (
          (tip &&
            contains(tip, evtTarget) &&
            contains(target, relatedTarget)) ||
          (tip &&
            contains(target, evtTarget) &&
            contains(tip, relatedTarget)) ||
          (tip && contains(tip, evtTarget) && contains(tip, relatedTarget)) ||
          (contains(target, evtTarget) && contains(target, relatedTarget))
        ) {
          return
        }
        this.leave(evt)
      }
    },
    click(evt) {
      if (!this.$_enabled) {
        return
      }
      attemptFocus(evt.currentTarget)
      this.activeTrigger.click = !this.activeTrigger.click
      if (this.isWithActiveTrigger) {
        this.enter(null)
      } else {
        this.leave(null)
      }
    },
    toggle() {
      if (!this.$_enabled) {
        return
      }

      if (this.localShow) {
        this.leave(null)
      } else {
        this.enter(null)
      }
    },
    enter(evt = null) {
      if (evt) {
        this.activeTrigger[evt.type === 'focusin' ? 'focus' : 'hover'] = true
      }
      if (this.localShow || this.$_hoverState === 'in') {
        this.$_hoverState = 'in'
        return
      }
      this.clearHoverTimeout()
      this.$_hoverState = 'in'
      if (!this.computedDelay.show) {
        this.show()
      } else {
        this.$_hoverTimeout = setTimeout(() => {
          /* istanbul ignore else */
          if (this.$_hoverState === 'in') {
            this.show()
          }
        }, this.computedDelay.show)
      }
    },
    leave(evt = null) {
      if (evt) {
        this.activeTrigger[evt.type === 'focusout' ? 'focus' : 'hover'] = false
        if (
          evt.type === 'focusout' &&
          arrayIncludes(this.computedTriggers, 'blur')
        ) {
          this.activeTrigger.click = false
          this.activeTrigger.hover = false
        }
      }
      if (this.isWithActiveTrigger) {
        return
      }
      this.clearHoverTimeout()
      this.$_hoverState = 'out'
      if (!this.computedDelay.hide) {
        this.hide()
      } else {
        this.$_hoverTimeout = setTimeout(() => {
          if (this.$_hoverState === 'out') {
            this.hide()
          }
        }, this.computedDelay.hide)
      }
    },
  },
  render() {
    return null
  },
}
