<template>
  <div v-if="show" class="f-header">
    <f-mode-wrapper />
    <div v-if="showLeft" class="f-header-logo">
      <transition name="f-fade-enter">
        <f-button-link
          v-if="showBack"
          key="back"
          class="f-btn-methods"
          @click="goMenu"
        >
          <f-svg class="f-mr-8" name="bars" size="lg" />
          <span v-text="$t('all_methods')" />
        </f-button-link>
        <f-logo v-else-if="showLogo" key="logo" />
      </transition>
    </div>
    <div v-if="showLang" class="f-header-menu">
      <f-form-base>
        <f-form-item-select2
          input-class="f-lang"
          :value="lang"
          :options="locale"
          no-label-floating
          dropdown-placement="bottomright"
          @change="changeLang"
        />
      </f-form-base>
    </div>
  </div>
</template>

<script>
import FModeWrapper from '@/components/mode-wrapper'
import FButtonLink from '@/components/button/button-link'
import FSvg from '@/components/svg'
import { FLogo } from '@/import'
import FFormBase from '@/components/form/form/form-base'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'
import { sort, parseSelect } from '@/utils/sort'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import FFormItemSelect2 from '@/components/form/item/select2'

export default {
  components: {
    FModeWrapper,
    FButtonLink,
    FSvg,
    FLogo,
    FFormBase,
    FFormItemSelect2,
  },
  mixins: [resizeMixin],
  props: {
    back: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['isOnlyCard', 'isOnlyWallets', 'mode_test']),
    ...mapState('params', ['lang']),
    ...mapState('options', [
      'locales',
      'full_screen',
      'disable_request',
      'show_test_mode',
      'show_lang',
    ]),
    show() {
      return this.showMode || this.showLeft || this.showLang
    },
    showMode() {
      return this.disable_request || (this.show_test_mode && this.mode_test)
    },
    showLeft() {
      return this.showBack || this.showLogo
    },
    showLang() {
      return this.full_screen && this.show_lang && this.locales.length > 1
    },
    locale() {
      return this.locales.map(parseSelect).sort(sort('text'))
    },
    showBack() {
      return !this.isLogo && this.isBreakpointDownLg && this.back
    },
    isLogo() {
      return (
        (this.isOnlyCard && this.$meta.method === 'card') ||
        (this.isOnlyWallets && this.$meta.method === 'wallets') ||
        this.$route.name === 'most_popular'
      )
    },
    showLogo() {
      return this.full_screen
    },
  },
  methods: {
    changeLang(value) {
      this.store.changeLang(value)
      this.store.sendRequestInfo()
    },
    goMenu() {
      this.$router.push({ name: 'menu' }).catch(() => {})
    },
  },
}
</script>
