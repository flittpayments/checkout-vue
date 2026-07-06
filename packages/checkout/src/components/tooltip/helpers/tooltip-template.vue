<script>
import { scopedStyleAttrsMixin } from '@/mixins/scoped-style-attrs'
import { isFunction, isUndefinedOrNull } from '@/utils/inspect'
import { Popper } from '@/components/tooltip/helpers/popper'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  extends: Popper,
  mixins: [scopedStyleAttrsMixin],
  props: {
    // Used only by the directive versions
    html: makeProp(PROP_TYPE_BOOLEAN, false),
    // Other non-reactive (while open) props are pulled in from BVPopper
    id: makeProp(PROP_TYPE_STRING),
    matchTargetWidth: makeProp(PROP_TYPE_BOOLEAN),
  },
  data() {
    // We use data, rather than props to ensure reactivity
    // Parent component will directly set this data
    return {
      title: '',
      content: '',
      customClass: null,
      innerClass: null,
      interactive: true,
    }
  },
  computed: {
    templateClasses() {
      return [
        this.$style.style,
        this.$style[this.attachment],
        {
          // Disables pointer events to hide the tooltip when the user
          // hovers over its content
          [this.$style.noninteractive]: !this.interactive,
        },
        this.customClass,
      ]
    },
    templateAttributes() {
      return {
        // Apply attributes from root tooltip component
        ...this.$parent.$parent.$attrs,

        id: this.id,
        role: 'tooltip',
        tabindex: '-1',

        // Add the scoped style data attribute to the template root element
        ...this.scopedStyleAttrs,
      }
    },
    templateListeners() {
      // Used for hover/focus trigger listeners
      return {
        mouseenter: evt => {
          this.$emit('mouseenter', evt)
        },
        mouseleave: evt => {
          this.$emit('mouseleave', evt)
        },
        focusin: evt => {
          this.$emit('focusin', evt)
        },
        focusout: evt => {
          this.$emit('focusout', evt)
        },
      }
    },
  },
  methods: {
    renderTemplate(h) {
      // Title can be a scoped slot function
      const $title = isFunction(this.title)
        ? this.title({})
        : isUndefinedOrNull(this.title)
          ? h()
          : this.title

      // Directive versions only
      const domProps =
        this.html && !isFunction(this.title) ? { innerHTML: this.title } : {}

      return h(
        'div',
        {
          class: this.templateClasses,
          attrs: this.templateAttributes,
          on: this.templateListeners,
        },
        [
          !this.noArrow
            ? h('div', {
                ref: 'arrow',
                class: this.$uiClass('arrow', [this.attachment]),
              })
            : h(),
          h(
            'div',
            {
              class: [this.$style.inner, this.innerClass],
              style: {
                '--min-width': this.matchTargetWidth
                  ? this.target.offsetWidth + 'px'
                  : 0,
              },
              domProps,
            },
            [$title]
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

.noninteractive {
  pointer-events: none;
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
