<template>
  <transition name="f-fade-enter">
    <div v-if="renderImg" :class="$style.style">
      <img :src="svg" :class="$style.img" />
    </div>
    <div v-else-if="renderSvg" :class="$style.style" v-html="svg" />
    <f-loading v-else />
  </transition>
</template>

<script>
import { FLoading } from '@/import'
import QRCode from 'qrcode'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
} from '@/constants/props'
import { errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import { appendQueryParams } from '@/utils/url'

export default {
  components: { FLoading },
  props: {
    url: makeProp(PROP_TYPE_STRING, '', true),
    queryParams: makeProp(PROP_TYPE_OBJECT, {}),
    isSmall: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      svg: '',
    }
  },
  computed: {
    ...mapState('options', ['api_domain']),
    renderImg() {
      return this.isSmall && this.svg
    },
    renderSvg() {
      return !this.isSmall && this.svg
    },
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
      return this.isSmall ? this.createPng(url) : this.createSvg(url)
    },
    createPng(url) {
      return QRCode.toDataURL(url, {
        width: 96,
        margin: 0,
      })
    },
    createSvg(url) {
      return QRCode.toString(url, {
        type: 'svg',
        margin: 0,
      }).then(svg =>
        svg.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"')
      )
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

.img {
  height: 100%;
}
</style>
