<template>
  <transition name="f-fade-enter">
    <div v-if="svg" :class="$style.style" v-html="svg" />
    <f-loading v-else />
  </transition>
</template>

<script>
import { FLoading } from '@/import'
import QRCode from 'qrcode'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import { appendQueryParams } from '@/utils/url'

export default {
  components: { FLoading },
  props: {
    url: makeProp(PROP_TYPE_STRING, '', true),
    queryParams: makeProp(PROP_TYPE_OBJECT, {}),
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
        .then(model =>
          appendQueryParams(
            `https://${this.api_domain}/s/${model.attr('token')}`,
            this.queryParams
          )
        )
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

<style lang="scss" module>
.style {
  height: 100%;
}

.style svg {
  height: 100%;
}
</style>
