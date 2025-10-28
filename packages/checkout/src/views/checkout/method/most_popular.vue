<template>
  <component :is="component" :class="$style.wrapper">
    <template v-if="isBreakpointDownLg">
      <f-shadow v-if="full_screen" />
      <f-info />
      <f-price />
      <f-button-wallet-el :no-append="showWalletsTab" classname="f-mb-24" />
    </template>
    <f-bank
      :config="config"
      enable-country
      no-more
      no-search
      breakpoint="lg"
      :label="$t('most_popular_methods_in')"
      @select="select"
    />
    <div v-if="isBreakpointDownLg" :class="$style.btn">
      <f-button-default block @click="goMenu">
        <span v-text="$t('see_all_other_methods')" />
        <span><f-svg class="f-ml-8" name="arrow-right" size="lg" /></span>
      </f-button-default>
    </div>
  </component>
</template>

<script>
import { mapState } from '@/utils/store'
import FContainer from '@/components/base/container'
import FShadow from '@/components/base/shadow'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FBank from '@/views/checkout/method/bank'
import FButtonDefault from '@/components/button/button-default'
import FSvg from '@/components/svg'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FContainer,
    FShadow,
    FInfo,
    FPrice,
    FButtonWalletEl,
    FBank,
    FButtonDefault,
    FSvg,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('tabs', ['most_popular']),
    ...mapState(['ready', 'has_fields', 'showWalletsTab']),
    component() {
      return this.isBreakpointDownLg ? 'FContainer' : 'div'
    },
    config() {
      return this.most_popular || {}
    },
  },
  methods: {
    select({ method, id }) {
      if (method === 'wallets' && !this.has_fields) {
        this.$root.$emit('click-wallet', id)
      } else {
        this.$router.push({ name: method }).catch(() => {})
      }
    },
    goMenu() {
      this.$router.push({ name: 'menu' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
@use '@/scss/core/functions/functions';
@use '@/scss/core/mixins/sticky';

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.btn {
  margin-top: auto;
  padding-top: px-to-rem(24px);
  background: linear-gradient(
    to bottom,
    functions.fade($container_bg, 0),
    $container_bg #{px-to-rem(16px)},
    $container_bg
  );

  @include sticky.bottom(px-to-rem(32px));
}
</style>
