// Base on-demand component for tooltip / popover templates
//
// Currently:
//   Responsible for positioning and transitioning the template
//   Templates are only instantiated when shown, and destroyed when hidden
//

import { createPopper } from '@popperjs/core'
import Vue from 'vue'
import { Transition } from '@/utils/transition'
import { isElement, requestAF } from '@/utils/dom'
import { toFloat } from '@/utils/number'
import { HTMLElement, SVGElement } from '@/utils/safe-types'
import {
  PROP_TYPE_ARRAY_STRING,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  TOPLEFT: 'top',
  TOPRIGHT: 'top',
  RIGHTTOP: 'right',
  RIGHTBOTTOM: 'right',
  BOTTOMLEFT: 'bottom',
  BOTTOMRIGHT: 'bottom',
  LEFTTOP: 'left',
  LEFTBOTTOM: 'left',
}

const OffsetMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  TOPLEFT: 'top-end',
  TOPRIGHT: 'top-start',
  RIGHTTOP: 'right-end',
  RIGHTBOTTOM: 'right-start',
  BOTTOMLEFT: 'bottom-end',
  BOTTOMRIGHT: 'bottom-start',
  LEFTTOP: 'left-end',
  LEFTBOTTOM: 'left-start',
}

// @vue/component
export const Popper = Vue.extend({
  props: {
    // The minimum distance (in `px`) from the edge of the
    // tooltip/popover that the arrow can be positioned
    arrowPadding: makeProp(PROP_TYPE_NUMBER_STRING, 6),
    // 'clippingParents', 'viewport', 'window', or `Element`
    boundary: makeProp([HTMLElement, PROP_TYPE_STRING], 'clippingParents'),
    // Tooltip/popover will try and stay away from
    // boundary edge by this many pixels
    boundaryPadding: makeProp(PROP_TYPE_NUMBER_STRING, 5),
    fallbackPlacement: makeProp(PROP_TYPE_ARRAY_STRING, 'flip'),
    offset: makeProp(PROP_TYPE_NUMBER_STRING, 0),
    placement: makeProp(PROP_TYPE_STRING, 'top'),
    // Element that the tooltip/popover is positioned relative to
    target: makeProp([HTMLElement, SVGElement]),
  },
  data() {
    return {
      // reactive props set by parent
      noFade: false,
      // State related data
      localShow: true,
      attachment: this.getAttachment(this.placement),
    }
  },
  computed: {
    templateType() {
      // Overridden by template component
      return 'unknown'
    },
    popperConfig() {
      const { placement } = this
      return {
        placement: OffsetMap[String(placement).toUpperCase()] || 'auto',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, toFloat(this.offset, 0)],
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: Array.isArray(this.fallbackPlacement)
                ? this.fallbackPlacement
                : this.fallbackPlacement === 'flip'
                  ? []
                  : [this.fallbackPlacement],
            },
          },
          {
            name: 'arrow',
            options: {
              element: this.$refs.arrow,
              padding: this.arrowPadding,
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: this.boundaryPadding,
              boundary: this.boundary,
            },
          },
          {
            name: 'eventListeners',
            options: {
              scroll: true,
              resize: true,
            },
          },
          {
            name: 'onUpdate',
            enabled: true,
            phase: 'afterWrite',
            fn: ({ state }) => {
              this.popperPlacementChange(state)
            },
          },
        ],
      }
    },
  },
  created() {
    // Note: We are created on-demand, and should be guaranteed that
    // DOM is rendered/ready by the time the created hook runs
    this.$_popper = null
    // Ensure we show as we mount
    this.localShow = true
    // Create popper instance before shown
    this.$on('show', el => {
      this.popperCreate(el)
    })
    // Self destruct handler
    const handleDestroy = () => {
      this.$nextTick(() => {
        // In a `requestAF()` to release control back to application
        requestAF(() => {
          this.$destroy()
        })
      })
    }
    // Self destruct if parent destroyed
    this.$parent.$once('hook:destroyed', handleDestroy)
    // Self destruct after hidden
    this.$once('hidden', handleDestroy)
  },
  beforeMount() {
    // Ensure that the attachment position is correct before mounting
    // as our propsData is added after `new Template({...})`
    this.attachment = this.getAttachment(this.placement)
  },
  updated() {
    // Update popper if needed
    // TODO: Should this be a watcher on `this.popperConfig` instead?
    this.updatePopper()
  },
  beforeDestroy() {
    this.destroyPopper()
  },
  destroyed() {
    // Make sure template is removed from DOM
    const el = this.$el
    el && el.parentNode && el.parentNode.removeChild(el)
  },
  methods: {
    // "Public" method to trigger hide template
    hide() {
      this.localShow = false
    },
    // Private
    getAttachment(placement) {
      return AttachmentMap[String(placement).toUpperCase()] || 'auto'
    },
    popperCreate(el) {
      this.destroyPopper()
      // We use `el` rather than `this.$el` just in case the original
      // mountpoint root element type was changed by the template
      const target = isElement(this.target?.reference)
        ? this.target.reference
        : this.target
      if (target && el) {
        this.$_popper = createPopper(target, el, this.popperConfig)
      }
    },
    destroyPopper() {
      this.$_popper && this.$_popper.destroy()
      this.$_popper = null
    },
    updatePopper() {
      this.$_popper && this.$_popper.forceUpdate()
    },
    popperPlacementChange(data) {
      // Callback used by popper to adjust the arrow placement
      this.attachment = data.placement.split('-')[0]
    },
    renderTemplate(h) {
      // Will be overridden by templates
      return h('div')
    },
  },
  render(h) {
    // Note: `f-show` and 'f-fade' classes are only appled during transition
    return h(
      Transition,
      {
        // Transitions as soon as mounted
        props: { appear: true, noFade: this.noFade },
        on: {
          // Events used by parent component/instance
          beforeEnter: el => this.$emit('show', el),
          afterEnter: el => this.$emit('shown', el),
          beforeLeave: el => this.$emit('hide', el),
          afterLeave: el => this.$emit('hidden', el),
        },
      },
      [this.localShow ? this.renderTemplate(h) : h()]
    )
  },
})
