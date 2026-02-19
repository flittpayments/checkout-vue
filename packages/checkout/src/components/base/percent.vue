<template>
  <span>{{ percent }}</span>
</template>

<script>
import { PROP_TYPE_NUMBER } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mapState } from '@/utils/store'

export default {
  props: {
    value: makeProp(PROP_TYPE_NUMBER, 0),
  },
  computed: {
    ...mapState('params', ['lang']),
    format() {
      return new Intl.NumberFormat(this.lang, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    },
    percent() {
      try {
        return this.format.format(this.value)
      } catch {
        return parseFloat((this.value * 100).toFixed(2)) + '%'
      }
    },
  },
}
</script>
