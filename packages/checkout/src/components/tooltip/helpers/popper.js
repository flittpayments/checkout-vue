// Base on-demand component for tooltip templates
//
// Currently:
//   Responsible for positioning and transitioning the template
//   Templates are only instantiated when shown, and unmounted when hidden
//

import { h } from 'vue'
import { createPopper } from '@popperjs/core'
import { Transition } from '@/utils/transition'
import { HTMLElement, SVGElement } from '@/utils/safe-types'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export const Popper = {
  props: {
    boundary: makeProp([HTMLElement, PROP_TYPE_STRING], 'clippingParents'),
    placement: makeProp(PROP_TYPE_STRING, 'top'),
    target: makeProp([HTMLElement, SVGElement]),
    noArrow: makeProp(PROP_TYPE_BOOLEAN),
  },
  emits: ['show', 'shown', 'hide', 'hidden'],
  data() {
    return {
      noFade: false,
      localShow: true,
      attachment: this.getAttachment(this.placement),
    }
  },
  computed: {
    popperConfig() {
      const { placement } = this
      return {
        placement,
        modifiers: [
          ...(this.noArrow
            ? []
            : [
                {
                  name: 'arrow',
                  options: {
                    element: this.$refs.arrow,
                  },
                },
              ]),
          {
            name: 'preventOverflow',
            options: {
              padding: 5,
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
    this.$_popper = null
    this.localShow = true
  },
  beforeMount() {
    this.attachment = this.getAttachment(this.placement)
  },
  updated() {
    this.updatePopper()
  },
  beforeUnmount() {
    this.destroyPopper()
  },
  unmounted() {
    const el = this.$el
    el && el.parentNode && el.parentNode.removeChild(el)
  },
  methods: {
    hide() {
      this.localShow = false
    },
    getAttachment(placement) {
      return placement.split('-')[0]
    },
    popperCreate(el) {
      this.destroyPopper()

      this.$_popper = createPopper(this.target, el, this.popperConfig)
    },
    destroyPopper() {
      this.$_popper && this.$_popper.destroy()
      this.$_popper = null
    },
    updatePopper() {
      this.$_popper && this.$_popper.forceUpdate()
    },
    popperPlacementChange(state) {
      this.attachment = state.placement.split('-')[0]
    },
  },
  render() {
    // Note: `f-show` and 'f-fade' classes are only appled during transition
    return h(
      Transition,
      {
        // Transitions as soon as mounted
        appear: true,
        noFade: this.noFade,
        // Events used by parent component/instance
        onBeforeEnter: el => {
          this.$nextTick(() => {
            this.popperCreate(el)
          })
          this.$emit('show', el)
        },
        onAfterEnter: el => this.$emit('shown', el),
        onBeforeLeave: el => this.$emit('hide', el),
        onAfterLeave: el => this.$emit('hidden', el),
      },
      {
        default: () => [this.localShow ? this.renderTemplate() : null],
      }
    )
  },
}
