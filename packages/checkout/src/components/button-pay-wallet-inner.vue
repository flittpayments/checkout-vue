<template>
  <f-button-inverted :class="classButton" block @click="click">
    <transition v-if="isGooglePay" name="f-fade">
      <iframe v-show="load" :class="$style.iframe" :src="src" @load="onLoad" />
    </transition>
    <div v-if="isGooglePay" :class="$style.click" />
  </f-button-inverted>
</template>

<script>
import FButtonInverted from '@/components/button/button-inverted'
import { mapState, mapStateGetSet } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER,
  PROP_TYPE_STRING,
} from '@/constants/props'

const supportLongSvg = [
  'ar',
  'bg',
  'ca',
  'zh',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'et',
  'fi',
  'fr',
  'de',
  'el',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'no',
  'pl',
  'pt',
  'ru',
  'sr',
  'sk',
  'sl',
  'es',
  'sv',
  'th',
  'tr',
  'uk',
]

export default {
  components: {
    FButtonInverted,
  },
  inject: ['validate'],
  props: {
    method: makeProp(PROP_TYPE_STRING, '', true),
    index: makeProp(PROP_TYPE_NUMBER),
    load: makeProp(PROP_TYPE_BOOLEAN),
  },
  computed: {
    ...mapStateGetSet(['need_validate_card']),
    ...mapState(['has_fields']),
    ...mapState('options', ['wallets_icons', 'theme']),
    ...mapStateGetSet('tabs', ['most_popular']),
    classButton() {
      return [
        this.$style.btn,
        this.$uiClass(this.method, {
          load: this.load,
        }),
      ]
    },
    color() {
      return {
        light: 'black',
        dark: 'white',
      }[this.theme.type]
    },
    isGooglePay() {
      return (
        this.method === 'google' && supportLongSvg.includes(this.$i18n.locale)
      )
    },
    src() {
      return `https://pay.google.com/gp/p/generate_gpay_btn_img?buttonColor=${this.color}&browserLocale=${this.$i18n.locale}&buttonSizeMode=fill`
    },
  },
  watch: {
    '$i18n.locale': 'watchLocale',
  },
  created() {
    this.wallets_icons.push(this.method)
    this.addMostPopular()
  },
  methods: {
    click() {
      if (this.has_fields) {
        this.need_validate_card = false
        this.$nextTick()
          .then(() => this.validate())
          .then(() => this.$emit('click', this.method))
          .finally(() => {
            this.need_validate_card = true
          })
          .catch(errorHandler)
      } else {
        this.$emit('click', this.method)
      }
    },
    onLoad() {
      this.$emit('update:load', true)
    },
    watchLocale(newValue, old) {
      if (supportLongSvg.includes(newValue) && supportLongSvg.includes(old))
        return

      this.$emit('update:load', false)
    },
    addMostPopular() {
      if (!this.most_popular) return

      this.$set(this.most_popular, this.method, {
        id: this.method,
        method: 'wallets',
        logo: this.method,
        name: `wallets_${this.method}`,
        user_priority: 98 - this.index,
        country: 'XX',
      })
    },
  },
}
</script>

<style lang="scss" module>
.btn {
  height: px-to-rem(44px);
  margin-bottom: px-to-rem(24px);

  &:last-child {
    margin: 0;
  }

  &::after {
    padding: px-to-rem(10px);
    background-repeat: no-repeat;
    background-position: center center;
    background-origin: content-box;
    background-size: contain;
  }
}

.iframe {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  width: 100%;
  border: 0;
  color-scheme: light;
}

.click {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
}

.apple {
  min-width: px-to-rem(100px);
}

.google.google {
  min-width: px-to-rem(240px);
  padding: 0;
}

.google_light::after {
  background-image: url('https://www.gstatic.com/instantbuy/svg/dark_gpay.svg');
}

.google_dark::after {
  background-image: url('https://www.gstatic.com/instantbuy/svg/light_gpay.svg');
}

.google_load::after {
  background-image: none;
}

.apple_light::after {
  background-image: url('#{$public-path}img/apple-pay-dark.svg');
}

.apple_dark::after {
  background-image: url('#{$public-path}img/apple-pay-light.svg');
}
</style>
