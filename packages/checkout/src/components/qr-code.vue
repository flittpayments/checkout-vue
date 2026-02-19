<template>
  <div v-html="svg" />
</template>

<script>
import QRCode from 'qrcode'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'

export default {
  props: {
    value: makeProp(PROP_TYPE_STRING, '', true),
  },
  data() {
    return {
      svg: '',
    }
  },
  mounted() {
    QRCode.toString(this.value, {
      type: 'svg',
      margin: 0,
    })
      .then(svg => {
        this.svg = svg
      })
      .catch(errorHandler)
  },
}
</script>
