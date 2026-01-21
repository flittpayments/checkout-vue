<template>
  <f-row-error
    v-slot="scope"
    v-bind="attrs"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <div :class="$style.inner">
      <slot v-bind="scope" />
      <label
        v-if="prepend"
        :for="id"
        :class="$uiClass('prepend')"
        @click="emitFocus"
      >
        <f-svg :name="prepend" fw />
      </label>
      <label v-if="label" :class="classLabel" :for="id" @click="emitFocus">
        {{ $t(label) }}
      </label>
    </div>
  </f-row-error>
</template>

<script>
import FRowError from '@/components/input/helpers/row-error'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ANY,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { isUndefinedOrNullOrEmpty } from '@/utils/inspect'

export default {
  components: {
    FRowError,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['44', '56'].includes(value)
    ),
    prepend: makeProp(PROP_TYPE_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
    modelValue: makeProp(PROP_TYPE_ANY),
    focused: makeProp(PROP_TYPE_BOOLEAN),
    labelClass: makeProp(PROP_TYPE_STRING),
  },
  emits: ['focus'],
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        modelValue: this.modelValue,
        disabled: this.disabled,
        focused: this.focused,
      }
    },
    isActive() {
      return !isUndefinedOrNullOrEmpty(this.modelValue) || this.focused
    },
    classLabel() {
      return [
        this.$uiClass('label'),
        this.$style[`label_${this.size}`],
        this.labelClass,
        {
          [this.$style.label_active]: this.isActive,
          [this.$uiClass('label_hover')]: this.hover,
          [this.$uiClass('label_focus')]: this.focused,
          [this.$uiClass('label_disabled')]: this.disabled,
          [this.$style.label_prepend]: this.prepend,
        },
      ]
    },
  },
  methods: {
    mouseenter() {
      this.hover = true
    },
    mouseleave() {
      this.hover = false
    },
    emitFocus() {
      this.$emit('focus')
    },
  },
}
</script>

<style lang="scss" module>
@use '@/scss/core/mixins/text';

.inner {
  position: relative;
}

.prepend {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  color: var(--color);
}

.prepend_light {
  --color: #{$grey};
}

.prepend_dark {
  --color: #{$white_04};
}

.label {
  position: absolute;
  right: px-to-rem(28px);
  left: px-to-rem(12px);
  font-size: px-to-rem(16px);
  line-height: px-to-rem(24px);
  color: var(--color);
  transition: transform ease-in-out 0.15s;
  transform-origin: 0 0;
  @include text.truncate;
}

.label_light {
  --color: #{$grey_1};
}

.label_dark {
  --color: #{$white_04};
}

.label_56 {
  top: px-to-rem(17px);
}

.label_44 {
  top: px-to-rem(10px);
}

.label_active {
  transform: translateY(-8px) scale(0.75);
}

.label_hover_light {
  --color: #{$grey_2};
}

.label_hover_dark {
  --color: #b1b2b4;
}

.label_focus_light {
  --color: #{$grey_2};
}

.label_focus_dark {
  --color: #{$white_04};
}

.label_disabled_light {
  --color: #{$grey_1};
}

.label_disabled_dark {
  --color: #{$white_04};
}

.label_prepend {
  left: px-to-rem(40px);
}
</style>
