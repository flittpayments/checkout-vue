<template>
  <div>
    <input
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      :class="$style.collector"
      aria-hidden="true"
      tabindex="-1"
      @input="onCollectorInput"
    />
    <div
      ref="group"
      class="f-row"
      role="group"
      aria-label="otp"
      :aria-describedby="showError ? safeId('error') : null"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <f-input
        v-for="index in count"
        :key="index"
        :ref="el => setItemRef(el, index - 1)"
        v-model="list[index - 1]"
        :maxlength="1"
        type="tel"
        inputmode="numeric"
        :aria-label="`Digit ${index} of ${count}`"
        class="f-col"
        :input-class="$style.item"
        size="48"
        :disabled="disabled"
        pattern="\d*"
        :formatter="formatter"
        @input="onInput(index - 1)"
        @keydown="onKeydown($event, index - 1)"
        @paste="onPaste"
      />
    </div>
    <f-error :id="safeId('error')" :show="showError">{{ errors[0] }}</f-error>
  </div>
</template>

<script>
import { useField } from 'vee-validate'
import FInput from '@/components/input/item/input'
import FError from '@/components/base/error'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { mask } from '@/utils/mask'
import { timeoutMixin } from '@/mixins/timeout'
import { idMixin } from '@/mixins/id'
import { contains, getActiveElement } from '@/utils/dom'
import { watch } from 'vue'

export default {
  components: {
    FInput,
    FError,
  },
  mixins: [timeoutMixin, idMixin],
  inject: ['isSubmit'],
  inheritAttrs: false,
  props: {
    modelValue: makeProp(PROP_TYPE_STRING, ''),
    count: makeProp(PROP_TYPE_NUMBER, 6),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const {
      value: fieldValue,
      meta,
      errors,
      handleBlur,
      setValue,
    } = useField('otp', `required|digits:${props.count}`, {
      initialValue: props.modelValue,
    })

    watch(
      () => props.modelValue,
      val => {
        if (val !== fieldValue.value) setValue(val)
      }
    )

    watch(fieldValue, val => {
      if (val !== props.modelValue) emit('update:modelValue', val)
    })

    return { meta, errors, handleBlur }
  },
  data() {
    return {
      inputs: [],
      list: Array.from({ length: this.count }, () => ''),
      i: 0,
      focused: false,
    }
  },
  computed: {
    innerValue() {
      return this.list.join('')
    },
    showError() {
      return Boolean(this.errors.length && this.isSubmit() && this.focused)
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        if (newVal !== this.innerValue) {
          this.list = Array.from(
            { length: this.count },
            (_, i) => newVal[i] || ''
          )
        }
        return
      }

      this.list = Array.from({ length: this.count }, () => '')
      this.i = 0
      this.focus()
    },
  },
  beforeUpdate() {
    this.inputs = []
  },
  mounted() {
    this.focus()
  },
  methods: {
    onInput(index) {
      const char = this.list[index]
      if (char && index < this.count - 1) {
        this.i = index + 1
        this.focus()
      }
      this.emit()
    },
    onKeydown({ key }, index) {
      if (key === 'Backspace' && !this.list[index] && index > 0) {
        this.i = index - 1
        this.list[this.i] = ''
        this.focus()
        this.emit()
      }
      if (key === 'ArrowLeft' && index > 0) {
        this.i = index - 1
        this.focus()
      }
      if (key === 'ArrowRight' && index < this.count - 1) {
        this.i = index + 1
        this.focus()
      }
    },
    onCollectorInput({ target }) {
      const raw = target.value || ''
      this.paste(raw)
      target.value = ''
    },
    onPaste(event) {
      event.preventDefault()

      const raw = (event.clipboardData || window.clipboardData).getData('text')
      if (!raw) return

      this.paste(raw)
    },
    onFocusIn() {
      this.clearTimeout('blur')
      this.focused = true
    },
    onFocusOut({ relatedTarget }) {
      if (contains(this.$refs.group, relatedTarget)) return

      this.timeout('blur', 50)
    },
    setItemRef(el, index) {
      if (el) {
        this.inputs[index] = el
      }
    },
    paste(raw) {
      const chars = mask(raw, '#'.repeat(this.count)).slice(0, this.count)
      if (!chars) return

      Array.from({ length: this.count }).forEach((_, index) => {
        this.list[index] = chars[index] || ''
      })

      const firstEmpty = this.list.findIndex(c => !c)
      this.i = firstEmpty === -1 ? this.count - 1 : firstEmpty

      this.focus()
      this.emit()
    },
    blur() {
      this.focused = contains(this.$refs.group, getActiveElement())
      if (!this.focused) {
        this.handleBlur()
      }
    },
    emit() {
      this.$emit('update:modelValue', this.innerValue)
    },
    focus() {
      if (this.disabled) return
      this.$nextTick(() => {
        const input = this.inputs && this.inputs[this.i]
        if (!input) return

        input.focus()
      })
    },
    formatter(value) {
      return mask(value, '#')
    },
  },
}
</script>

<style lang="scss" module>
.item {
  text-align: center;
}
.collector {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  left: -9999px;
}
</style>
