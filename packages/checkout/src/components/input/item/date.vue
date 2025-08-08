<template>
  <f-input v-if="isMobile" v-bind="attrs" v-on="$listeners" />
  <date-picker
    v-else
    v-bind="attrsDatepicker"
    v-on="$listeners"
    @open="onOpen"
    @close="close"
  >
    <template #icon-calendar>
      <f-svg :class="classArrow" size="16" name="angle-down" />
    </template>
  </date-picker>
</template>

<script>
import { FInput, DatePicker } from '@/import'
import FSvg from '@/components/svg'
import { idMixin, idProps } from '@/mixins/id'
import { isMobile } from '@/utils/mobile'
import { createDate, format } from '@/utils/date'
import { mapState } from '@/utils/store'
import { formatRegion, formatServer } from '@/config/date'
import {
  PROP_TYPE_ARRAY_OBJECT_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    DatePicker,
    FInput,
    FSvg,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    // required for ValidationProvider
    value: makeProp(PROP_TYPE_STRING),
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    inputClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['44', '48', '56'].includes(value)
    ),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    floating: makeProp(PROP_TYPE_BOOLEAN, false),
    min: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['now'], value)
    ),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      open: false,
      map: {
        now: this.getDate(createDate()),
      },
    }
  },
  computed: {
    ...mapState(['region']),
    attrs() {
      const { value, invalid, inputClass, size, variant, floating, disabled } =
        this
      return {
        ...this.$attrs,
        ref: 'input',
        // required for ValidationProvider
        value,
        id: this.safeId(),
        invalid,
        inputClass,
        size,
        variant,
        floating,
        min: this.minFormat,
        disabled,
      }
    },
    attrsDatepicker() {
      return {
        ...this.$attrs,
        ref: 'input',
        // required for ValidationProvider
        value: this.value,
        lang: this.$t('datepicker'),
        clearable: false,
        format: this.format,
        inputClass: this.className,
        inputAttr: {
          id: this.safeId(),
        },
        valueType: formatServer,
        prefixClass: 'f-datepicker',
        appendToBody: false,
        disabled: this.disabled,
        disabledDate: this.disabledDate,
      }
    },
    className() {
      return [
        this.style.input,
        this.$uiClass(this.variant, {}, 'style'),
        this.style[`size_${this.size}`],
        this.inputClass,
        {
          [this.style.error]: this.invalid,
          [this.style[`floating_${this.size}`]]: this.floating,
        },
      ]
    },
    classArrow() {
      return this.$uiClass('arrow', { open: this.open })
    },
    format() {
      return formatRegion[this.region] || formatRegion.default
    },
    minDate() {
      if (!this.min) return

      return this.map[this.min]
    },
    minFormat() {
      if (!this.min) return

      return format(this.minDate, formatServer)
    },
    isMobile() {
      return isMobile
    },
  },
  methods: {
    onOpen() {
      this.open = true
    },
    close() {
      this.open = false
    },
    disabledDate(date) {
      return date < this.minDate
    },
    getDate(date) {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date
    },
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>

<style lang="scss" module="style">
@import '@/scss/core/input.module';
</style>

<style lang="scss">
@import '@/scss/core/datepicker';
</style>

<style lang="scss" module>
.arrow {
  transform: rotate(0deg);
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
  transform: rotate(-180deg);
}
</style>
