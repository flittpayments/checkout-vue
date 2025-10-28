<template>
  <div v-if="show" :class="$uiClass('wrapper')">
    <f-mode-wrapper />
    <div v-if="showLeft" :class="classLeft">
      <transition name="f-fade-enter">
        <f-button-link
          v-if="showBack"
          key="back"
          :class="$style.back"
          @click="goMenu"
        >
          <f-svg :class="$style.mr_8" name="bars" size="lg" />
          <span v-text="$t('all_methods')" />
        </f-button-link>
        <f-logo v-else-if="showLogo" key="logo" />
      </transition>
    </div>
    <div v-if="showRight" :class="$uiClass('right')">
      <f-select
        :input-class="$uiClass('lang')"
        :value="lang"
        :options="locale"
        dropdown-placement="bottomleft"
        data-e2e-lang
        @input="changeLang"
      />
    </div>
  </div>
</template>

<script>
import FModeWrapper from '@/components/mode-wrapper'
import FButtonLink from '@/components/button/button-link'
import FSvg from '@/components/svg'
import { FLogo, FSelect } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'
import { sort, parseSelect } from '@/utils/sort'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FModeWrapper,
    FButtonLink,
    FSvg,
    FLogo,
    FSelect,
  },
  mixins: [resizeMixin],
  props: {
    back: makeProp(PROP_TYPE_BOOLEAN, false),
    withoutSidebar: makeProp(PROP_TYPE_BOOLEAN, false),
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
      return this.showMode || this.showLeft || this.showRight
    },
    showMode() {
      return this.disable_request || (this.show_test_mode && this.mode_test)
    },
    showLeft() {
      return this.showBack || this.showLogo
    },
    showRight() {
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
    classLeft() {
      return this.$uiClass('left', {
        without_sidebar: this.withoutSidebar,
      })
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

<style lang="scss" module>
.wrapper {
  display: flex;
  min-height: px-to-rem(24px);
  background: $container_bg;
}

.wrapper_adaptive {
  @include breakpoints.up(xl) {
    border-radius: $border-radius-lg $border-radius-lg 0 0;
  }
}

.left {
  height: $header-height;
  display: flex;
  flex: 0 0 50%;
  flex-wrap: wrap;
  align-items: center;
  max-width: 50%;
  padding: px-to-rem(24px) 0 0 px-to-rem(20px);
}

.left_light {
  --border-color: #{$ash_400};
}

.left_dark {
  --border-color: #222528;
}

.left_adaptive {
  @include breakpoints.up(md) {
    padding-left: px-to-rem(40px);
  }

  @include breakpoints.up(lg) {
    flex: 0 0 410px;
    max-width: 410px;
    border-right: px-to-rem(2px) solid var(--border-color);
  }

  @include breakpoints.up(xxl) {
    flex: 0 0 450px;
    max-width: 450px;
    padding-left: px-to-rem(60px);
  }
}

.left_without_sidebar {
  border-right: none;
}

.back {
  left: -(px-to-rem(8px));
  padding: px-to-rem(8px);
}

.mr_8 {
  margin-right: px-to-rem(8px);
}

.right {
  height: $header-height;
  display: flex;
  flex: 0 0 50%;
  align-items: center;
  justify-content: flex-end;
  max-width: 50%;
  padding: px-to-rem(24px) px-to-rem(20px) 0 0;
}

.right_adaptive {
  @include breakpoints.up(md) {
    padding: px-to-rem(24px) px-to-rem(24px) 0 0;
  }

  @include breakpoints.up(lg) {
    flex: 1;
    max-width: inherit;
    padding: px-to-rem(24px) px-to-rem(24px) 0 0;
  }

  @include breakpoints.up(xl) {
    padding: px-to-rem(24px) px-to-rem(24px) 0 0;
  }
}

.lang.lang {
  --border: 0px;
  --padding-top: 0px;
  --padding-right: #{px-to-rem(22px)};
  --padding-bottom: 0px;
  --padding-left: 0px;
  --right: 0;

  width: auto;
  height: px-to-rem(20px);
  line-height: px-to-rem(20px);
  color: var(--color);
  background: none;

  &:hover {
    background: none;
  }
}

.lang_light.lang_light {
  --color: #{$grey_2};
}

.lang_dark.lang_light {
  --color: #{$white_04};
}
</style>
