import { h, defineComponent, Transition as VueTransition } from 'vue'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

const NO_FADE_PROPS = {
  enterFromClass: '',
  enterActiveClass: '',
  enterToClass: 'f-show',
  leaveFromClass: 'f-show',
  leaveActiveClass: '',
  leaveToClass: '',
}

const FADE_PROPS = {
  ...NO_FADE_PROPS,
  enterActiveClass: 'f-fade',
  leaveActiveClass: 'f-fade',
}

export const Transition = defineComponent({
  props: {
    appear: makeProp(PROP_TYPE_BOOLEAN, false),
    noFade: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  render() {
    const transProps = this.noFade ? NO_FADE_PROPS : FADE_PROPS
    const appearProps = this.appear
      ? {
          appear: true,
          appearFromClass: transProps.enterFromClass,
          appearActiveClass: transProps.enterActiveClass,
          appearToClass: transProps.enterToClass,
        }
      : {}

    return h(
      VueTransition,
      {
        ...this.$attrs,
        ...transProps,
        ...appearProps,
      },
      {
        default: this.$slots.default,
      }
    )
  },
})
