<script>
import { h } from 'vue'
import { Popper } from '@/components/tooltip/helpers/popper'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  name: 'TooltipTemplate',
  extends: Popper,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    matchTargetWidth: makeProp(PROP_TYPE_BOOLEAN),
  },
  emits: ['mouseenter', 'mouseleave', 'focusin', 'focusout'],
  data() {
    return {
      content: () => null,
      customClass: null,
      innerClass: null,
    }
  },
  computed: {
    templateClasses() {
      return [this.$style.style, this.$style[this.attachment], this.customClass]
    },
    templateAttributes() {
      return {
        id: this.id,
        role: 'tooltip',
        tabindex: '-1',
      }
    },
  },
  methods: {
    renderTemplate() {
      return h(
        'div',
        {
          ...this.templateAttributes,
          class: this.templateClasses,
          onMouseenter: evt => this.$emit('mouseenter', evt),
          onMouseleave: evt => this.$emit('mouseleave', evt),
          onFocusin: evt => this.$emit('focusin', evt),
          onFocusout: evt => this.$emit('focusout', evt),
        },
        [
          !this.noArrow
            ? h('div', {
                ref: 'arrow',
                class: this.$uiClass('arrow', [this.attachment]),
              })
            : null,
          h(
            'div',
            {
              class: [this.$style.inner, this.innerClass],

              style: {
                '--min-width': this.matchTargetWidth
                  ? `${this.target.offsetWidth}px`
                  : 0,
              },
            },
            this.content()
          ),
        ]
      )
    },
  },
}
</script>

<style lang="scss" module>
$tooltip-arrow-width: px-to-rem(10px);
$tooltip-arrow-height: px-to-rem(7px);

.style {
  position: absolute;
  z-index: $zindex-tooltip;
  display: block;
  margin: 0;
  word-wrap: break-word;
  outline: 0;
}

.top,
.auto[data-popper-placement^='top'] {
  padding: $tooltip-arrow-height 0;
}

.right,
.auto[data-popper-placement^='right'] {
  padding: 0 $tooltip-arrow-height;
}

.bottom,
.auto[data-popper-placement^='bottom'] {
  padding: $tooltip-arrow-height 0;
}

.left,
.auto[data-popper-placement^='left'] {
  padding: 0 $tooltip-arrow-height;
}

.arrow {
  position: absolute;
  display: block;

  &::before {
    position: absolute;
    content: '';
    border-color: transparent;
    border-style: solid;
  }
}

.arrow_top,
.auto[data-popper-placement^='top'] .arrow {
  bottom: 0;
  width: $tooltip-arrow-width;
  height: $tooltip-arrow-height;

  &::before {
    border-top-color: var(--bg);
    top: 0;
    border-width: $tooltip-arrow-height calc($tooltip-arrow-width / 2) 0;
  }
}

.arrow_right,
.auto[data-popper-placement^='right'] .arrow {
  left: 0;
  width: $tooltip-arrow-height;
  height: $tooltip-arrow-width;

  &::before {
    border-right-color: var(--bg);
    right: 0;
    border-width: calc($tooltip-arrow-width / 2) $tooltip-arrow-height
      calc($tooltip-arrow-width / 2) 0;
  }
}

.arrow_bottom,
.auto[data-popper-placement^='bottom'] .arrow {
  top: 0;
  width: $tooltip-arrow-width;
  height: $tooltip-arrow-height;

  &::before {
    border-bottom-color: var(--bg);
    bottom: 0;
    border-width: 0 calc($tooltip-arrow-width / 2) $tooltip-arrow-height;
  }
}

.arrow_left,
.auto[data-popper-placement^='left'] .arrow {
  right: 0;
  width: $tooltip-arrow-height;
  height: $tooltip-arrow-width;

  &::before {
    border-left-color: var(--bg);
    left: 0;
    border-width: calc($tooltip-arrow-width / 2) 0
      calc($tooltip-arrow-width / 2) $tooltip-arrow-height;
  }
}

.inner {
  color: var(--color);
  background-color: var(--bg);
  opacity: var(--opacity);

  display: flex;
  align-items: center;
  width: 100%;
  min-width: var(--min-width);
  max-width: var(--max-width);
  padding: var(--padding);
  font-weight: 500;
  border-radius: $border-radius;
  box-shadow: var(--shadow);
}
</style>
