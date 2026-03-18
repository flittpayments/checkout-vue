<template>
  <transition name="f-fade-enter">
    <div v-if="svg" v-html="svg" />
    <f-loading v-else />
  </transition>
</template>

<script>
import { FLoading } from '@/import'
import QRCode from 'qrcode'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'

export default {
  components: { FLoading },
  props: {
    url: makeProp(PROP_TYPE_STRING, '', true),
  },
  data() {
    return {
      svg: '',
    }
  },
  computed: {
    ...mapState('options', ['api_domain']),
  },
  created() {
    this.getUrl()
      .then(this.generateQRCode)
      .then(svg => {
        this.svg = svg
      })
      .catch(errorHandler)
  },
  methods: {
    getUrl() {
      if (new URL(this.url).hostname === this.api_domain) {
        return this.shortener()
      }

      return Promise.resolve(this.url)
    },
    shortener() {
      return this.store
        .sendRequestBase('api.checkout.shortener', 'get', {
          url: this.url,
        })
        .then(model => `https://${this.api_domain}/s/${model.attr('token')}`)
        .catch(() => this.url)
    },
    generateQRCode(url) {
      return QRCode.toString(url, {
        type: 'svg',
        margin: 0,
      })
    },
  },
}
</script>
