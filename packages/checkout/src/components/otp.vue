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
      <f-form-item-input
        v-for="(_, index) in list"
        :key="index"
        ref="inputs"
        v-model="list[index]"
        :name="index === 0 ? safeId() : ''"
        :maxlength="1"
        type="tel"
        inputmode="numeric"
        :aria-label="`Digit ${index + 1} of ${count}`"
        class="f-col"
        :input-class="$style.item"
        size="48"
        no-label-floating
        :disabled="disabled"
        pattern="\d*"
        :format="format"
        @input="onInput(index)"
        @keydown="onKeydown($event, index)"
        @paste="onPaste"
      />
    </div>
    <transition name="f-slide-fade">
      <div
        v-if="showError"
        :id="safeId('error')"
        class="f-error"
        aria-live="polite"
      >
        {{ errors[0] }}
      </div>
    </transition>
    <ValidationProvider v-slot="scope" v-bind="attrsValidation">
      <input :value="innerValue" type="hidden" />
      <template v-if="updateState(scope)" />
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import FFormItemInput from '@/components/form/item/input'
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

export default {
  components: {
    ValidationProvider,
    FFormItemInput,
  },
  mixins: [timeoutMixin, idMixin],
  inject: ['isSubmit'],
  inheritAttrs: false,
  props: {
    value: makeProp(PROP_TYPE_STRING, ''),
    count: makeProp(PROP_TYPE_NUMBER, 6),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      errors: [],
      list: Array.from({ length: this.count }, () => ''),
      i: 0,
      focused: false,
    }
  },
  computed: {
    innerValue() {
      return this.list.join('')
    },
    attrsValidation() {
      return {
        vid: this.safeId(),
        rules: `required|digits:${this.count}`,
        immediate: true,
      }
    },
    showError() {
      return this.errors.length && this.isSubmit() && this.focused
    },
  },
  watch: {
    value(newVal) {
      if (newVal) return

      this.list = Array.from({ length: this.count }, () => '')
      this.i = 0
      this.focus()
    },
  },
  mounted() {
    this.focus()
  },
  methods: {
    updateState({ errors }) {
      this.errors = errors
      return true
    },
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
        this.$set(this.list, this.i, '')
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
    paste(raw) {
      const chars = mask(raw, '#'.repeat(this.count)).slice(0, this.count)
      if (!chars) return

      Array.from({ length: this.count }).forEach((_, index) => {
        this.$set(this.list, index, chars[index] || '')
      })

      const firstEmpty = this.list.findIndex(c => !c)
      this.i = firstEmpty === -1 ? this.count - 1 : firstEmpty

      this.focus()
      this.emit()
    },
    blur() {
      this.focused = contains(this.$refs.group, getActiveElement())
    },
    emit() {
      this.$emit('input', this.innerValue)
    },
    focus() {
      if (this.disabled) return
      this.$nextTick(() => {
        const input = this.$refs.inputs && this.$refs.inputs[this.i]
        if (!input) return

        input.focused()
      })
    },
    format(value) {
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
