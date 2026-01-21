<template>
  <f-modal-tooltip v-bind="attrs" ref="mt" @show="show" @hide="hide">
    <template #text>
      <template v-if="active.value">
        <slot name="text" :item="active">
          {{ active.text }}
        </slot>
      </template>
      <template v-else-if="!floating">{{ placeholder }}</template>
      <f-svg :class="classArrow" size="16" name="angle-down" />
    </template>
    <template #default>
      <f-form-base v-if="showSearch" :class="$style.search">
        <f-row
          ref="search"
          :value="text"
          :class="$style.mb_0"
          label="default_country"
          size="44"
          prepend="search"
          :autofocus="autofocus"
          autocomplete="off"
          variant="secondary"
          @input="input"
          @keydown="navigate"
        />
      </f-form-base>
      <f-button-unstyled
        v-for="(item, key) in list"
        :key="key"
        :ref="el => setItemRef(el, key)"
        :class="classItem(item, key)"
        :data-e2e-select-item="item.value"
        @click="click(item)"
        @keydown="navigate"
        @focus="onFocus(key)"
      >
        <slot name="item" :item="item" :is-active="isActive(item)">
          {{ item.text }}
          <span v-if="isActive(item)" :class="$style.active">•</span>
        </slot>
      </f-button-unstyled>
    </template>
  </f-modal-tooltip>
</template>

<script>
import FModalTooltip from '@/components/modal-tooltip'
import FFormBase from '@/components/form/form/form-base'
import FRow from '@/components/input/row'
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
  PROP_TYPE_ARRAY_OBJECT_STRING,
} from '@/constants/props'
import { attemptFocus, requestAF } from '@/utils/dom'
import { CODE_DOWN, CODE_ENTER, CODE_UP } from '@/constants/key-codes'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FModalTooltip,
    FFormBase,
    FRow,
    FButtonUnstyled,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    modelValue: makeProp(PROP_TYPE_NUMBER_STRING),
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    inputClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['44', '48', '56'].includes(value)
    ),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    floating: makeProp(PROP_TYPE_BOOLEAN, false),
    prepend: makeProp(PROP_TYPE_STRING),
    options: makeProp(PROP_TYPE_ARRAY, []),
    filter: makeProp(
      PROP_TYPE_FUNCTION,
      search =>
        ({ text }) =>
          text.toLowerCase().indexOf(search) === 0
    ),
    variantItem: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary', 'card'], value)
    ),
    search: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    placeholder: makeProp(PROP_TYPE_STRING, 'select'),
  },
  emits: ['update:modelValue', 'input', 'search'],
  data() {
    return {
      items: [],
      open: false,
      text: '',
      autofocus: false,
      index: 0,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        class: this.className,
        disabled: !this.options.length || this.disabled,
        scrollable: this.options.length > 10,
      }
    },
    className() {
      return [
        this.$style.select,
        this.style.input,
        this.$uiClass(this.variant, {}, 'style'),
        this.style[`size_${this.size}`],
        this.inputClass,
        {
          [this.style.error]: this.invalid,
          [this.style[`floating_${this.size}`]]: this.floating,
          [this.style.prepend]: this.prepend,
        },
      ]
    },
    showSearch() {
      return this.search && this.options.length > 10
    },
    list() {
      return this.options.filter(this.filter(this.text.toLowerCase()))
    },
    active() {
      return this.options.find(({ value }) => value === this.modelValue) || {}
    },
    classItem() {
      return (item, index) =>
        this.$uiClass(`item_${this.variantItem}`, {
          active: this.isActive(item),
          focus: index === this.index,
        })
    },
    classArrow() {
      return this.$uiClass('arrow', { open: this.open })
    },
  },
  beforeUpdate() {
    this.items = []
  },
  methods: {
    setItemRef(el, index) {
      if (el) {
        this.items[index] = el
      }
    },
    click({ value, disabled }) {
      if (disabled) return

      this.$emit('update:modelValue', value)
      this.$emit('input', value)
      this.$refs.mt.hide()
    },
    show() {
      this.open = true
      this.autofocus = true
      this.reset()
      this.$nextTick(() => {
        this.scroll()
      })
    },
    hide() {
      this.open = false
      this.text = ''
    },
    isActive(item) {
      return item.value === this.modelValue
    },
    navigate(ev) {
      const { keyCode } = ev
      switch (keyCode) {
        case CODE_DOWN:
          this.setIndex(this.index + 1)
          this.scroll()
          break
        case CODE_UP:
          this.setIndex(this.index - 1)
          this.scroll()
          break
        case CODE_ENTER:
          this.click(this.list[this.index])
          break
        default:
          return
      }
      ev.preventDefault()
    },
    reset() {
      let index = this.list.includes(this.active)
        ? this.list.indexOf(this.active)
        : 0

      this.setIndex(index)
    },
    scroll() {
      if (!this.list.length) return

      const el = this.items[this.index]?.$el
      if (!el) return
      el.scrollIntoView({
        block: 'center',
        // behavior: 'smooth',
      })

      if (this.showSearch) return
      attemptFocus(el)
    },
    setIndex(index) {
      this.index = Math.max(0, Math.min(this.list.length - 1, index))
    },
    input(value) {
      this.$emit('search', value)
      this.text = value
      requestAF(() => {
        this.reset()
        this.scroll()
      })
    },
    onFocus(index) {
      this.index = index
    },
    focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.mt.$el)
      }
    },
  },
}
</script>

<style lang="scss" module="style">
@use '@/scss/module/input.module';
</style>

<style lang="scss" module>
@use '@/scss/core/functions/functions';
@use '@/scss/core/mixins/text';
@use '@/scss/core/mixins/sticky';

.select {
  --padding-right: #{px-to-rem(24px)};
  --right: #{px-to-rem(8px)};

  position: relative;

  @include text.truncate;
}

.item_default {
  display: flex;
  width: 100%;
  padding: px-to-rem(3px) px-to-rem(8px);
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  color: #5a6470;
  border-radius: $border-radius-sm;

  &:focus {
    box-shadow: none;
  }

  &:hover {
    background: #f2f3f5;
  }
}

.item_secondary {
  display: flex;
  align-items: center;
  width: 100%;
  padding: px-to-rem(14px) px-to-rem(12px);
  font-size: px-to-rem(16px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  color: #5a6470;
  cursor: pointer;
  border-top: px-to-rem(1px) solid #eef0f2;
  transition:
    background-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &:first-of-type {
    border-top: none;
  }

  &:hover {
    background-color: $ash_100;
  }
}

.item_secondary:hover,
.item_secondary:focus,
.item_secondary_active,
.item_secondary_focus {
  text-decoration: none;
  border-color: transparent;
  border-radius: $border-radius;

  + .item_secondary {
    border-color: transparent;
  }
}

.item_secondary_focus {
  background-color: $ash_100;
}

.item_secondary_active {
  background-color: $ash_200;
}

.item_card {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: px-to-rem(60px);
  padding: px-to-rem(10px);
  margin-bottom: px-to-rem(4px);
  color: $grey_2;
  cursor: pointer;
  border-radius: 0;
  transition:
    background-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: $ash_100;
  }
}

.item_card_active {
  background-color: $ash_200;
}

.arrow {
  position: absolute;
  top: 50%;
  right: var(--right);
  transform: translateY(-50%) rotate(0deg);
  color: var(--color);
  transition: transform 0.225s cubic-bezier(0.4, 0, 0.6, 1);
}

.arrow_light {
  --color: #{$grey_1};
  --open-color: #{$grey};
}

.arrow_dark {
  --color: #{$white_04};
  --open-color: #{$white};
}

.arrow_open {
  color: var(--open-color);
  transform: translateY(-50%) rotate(-180deg);
}

.search {
  padding-top: px-to-rem(4px);
  padding-bottom: px-to-rem(20px);
  background-image: linear-gradient(
    to bottom,
    $white,
    $white calc(100% - #{px-to-rem(20px)}),
    functions.fade($white, 0)
  );
  @include sticky.top;
}

.active {
  margin-left: auto;
  padding-left: px-to-rem(8px);
}

.mb_0 {
  margin-bottom: 0;
}
</style>
