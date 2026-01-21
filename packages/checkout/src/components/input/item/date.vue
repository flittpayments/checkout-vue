<template>
  <f-input v-bind="attrs" />
</template>

<script>
import { FInput } from '@/import'
import { createDate, format } from '@/utils/date'
import { mapState } from '@/utils/store'
import { formatServer } from '@/config/date'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FInput,
  },
  inheritAttrs: false,
  props: {
    min: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['now'], value)
    ),
  },
  data() {
    return {
      map: {
        now: this.getDate(createDate()),
      },
    }
  },
  computed: {
    ...mapState(['region']),
    attrs() {
      return {
        ...this.$attrs,
        ref: 'input',
        min: this.minFormat,
      }
    },
    minDate() {
      if (!this.min) return

      return this.map[this.min]
    },
    minFormat() {
      if (!this.min) return

      return format(this.minDate, formatServer)
    },
  },
  methods: {
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
