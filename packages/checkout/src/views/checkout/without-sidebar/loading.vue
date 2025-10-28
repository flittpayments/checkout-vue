<template>
  <div :class="$uiClass('wrapper')">
    <div :class="$uiClass('col')">
      <div
        :class="$uiClass('title')"
        v-text="$t('approve_payment_in_app', { name: info.name })"
      />
      <div :class="$uiClass('desc')">{{ desc }}</div>
      <div :class="$uiClass('loading')">
        <svg-loading :class="$uiClass('loading_svg')" />
        <span
          :class="$uiClass('loading_text')"
          v-text="$t('waiting_for_confirmation')"
        />
      </div>
    </div>
    <div :class="$uiClass('col')">
      <div :class="$uiClass('mobile_outer')">
        <div :class="$uiClass('mobile_inner')">
          <div :class="$uiClass('mobile_top')">
            <div :class="$uiClass('mobile_top_1')" />
            <div :class="$uiClass('mobile_top_2')" />
          </div>
          <div>
            <f-icon
              :name="info.bank_logo"
              :type="method"
              :class="$uiClass('logo')"
              size="48"
            />
            <div :class="$uiClass('processing')" v-text="$t('processing')" />
            <div
              :class="$uiClass('processing_desc')"
              v-text="$t('redirected_automatically_after_confirmation')"
            />
          </div>
          <div :class="$uiClass('mobile_bottom')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgLoading from '@/svg/loading.svg'
import FIcon from '@/components/icon'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    SvgLoading,
    FIcon,
  },
  inject: ['cancelWaitForFinalOrderStatus', 'waitForFinalOrderStatus'],
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      count: 0,
    }
  },
  computed: {
    ...mapState(['tabs']),
    info() {
      return this.tabs[this.method][this.system]
    },
    desc() {
      // $t('confirm_payment_in_app_banks')
      // $t('confirm_payment_in_app_installments')
      return this.$t(`confirm_payment_in_app_${this.method}`, {
        name: this.info.name,
      })
    },
  },
  created() {
    this.cancelWaitForFinalOrderStatus()
    this.waitForFinalOrderStatus()
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.wrapper_adaptive {
  @include breakpoints.up(xl) {
    padding: 0 px-to-rem(80px);
  }
}

.col {
  width: 100%;
}

.col_adaptive {
  @include breakpoints.up(md) {
    width: 50%;
  }
}

.title {
  font-size: px-to-rem(24px);
  line-height: px-to-rem(34px);
  font-weight: 500;
  margin: px-to-rem(16px) 0;
}

.title_adaptive {
  @include breakpoints.up(md) {
    margin-bottom: px-to-rem(16px);
  }
}

.title_light {
  color: #000;
}

.title_dark {
  color: #fff;
}

.desc {
  font-size: px-to-rem(22px);
  line-height: px-to-rem(34px);
  font-weight: 400;
  margin-bottom: px-to-rem(24px);
}

.desc_light {
  color: #000;
}

.loading {
  display: flex;
  align-items: center;
  gap: px-to-rem(20px);
  margin-bottom: px-to-rem(24px);
}

.loading_adaptive {
  @include breakpoints.up(md) {
    margin-bottom: 0;
  }
}

.loading_svg {
  width: px-to-rem(32px);
  height: px-to-rem(32px);
  animation: f-svg-spin 2s infinite linear;
}

@keyframes f-svg-spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(1turn);
  }
}

.loading_text {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(34px);
  font-weight: 400;
}

.loading_text_light {
  color: #7b7b7b;
}

.mobile_outer {
  --border-radius: #{px-to-rem(40px)};
  --border-width: #{px-to-rem(8px)};

  width: px-to-rem(260px);
  height: px-to-rem(516px);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  margin: auto;
}

.mobile_outer_light {
  --border-color: #eee;
}

.mobile_outer_dark {
  --border-color: #797c7e;
}

.mobile_inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
  border-radius: calc(var(--border-radius) - var(--border-width));
  box-shadow: 0 px-to-rem(3px) px-to-rem(3px) 0 rgba(#767676, 0.25);
  background: var(--bg);
  padding: px-to-rem(12px) px-to-rem(40px);
  text-align: center;
}

.mobile_inner_light {
  --bg: #fff;
}

.mobile_inner_dark {
  --bg: #313539;
}

.mobile_top {
  display: flex;
  gap: px-to-rem(6px);
  justify-content: center;
}

.mobile_top_1 {
  width: px-to-rem(8px);
  height: px-to-rem(8px);
  background: var(--bg);
  border-radius: px-to-rem(4px);
}

.mobile_top_1_light {
  --bg: #eee;
}

.mobile_top_1_dark {
  --bg: #797c7e;
}

.mobile_top_2 {
  width: px-to-rem(36px);
  height: px-to-rem(8px);
  background: var(--bg);
  border-radius: px-to-rem(4px);
}

.mobile_top_2_light {
  --bg: #eee;
}

.mobile_top_2_dark {
  --bg: #797c7e;
}

.mobile_bottom {
  align-self: center;
  width: px-to-rem(64px);
  height: px-to-rem(8px);
  background: var(--bg);
  border-radius: px-to-rem(4px);
}

.mobile_bottom_light {
  --bg: #eee;
}

.mobile_bottom_dark {
  --bg: #797c7e;
}

.logo {
  box-shadow: 0 px-to-rem(1px) px-to-rem(4px) 0 var(--shadow-color);
  border-radius: $border-radius;
  margin-bottom: px-to-rem(12px);
}

.logo_light {
  --shadow-color: #cacfd6;
}

.logo_dark {
  --shadow-color: #313539;
}

.processing {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(34px);
  font-weight: 500;
}

.processing_light {
  color: #000;
}

.processing_dark {
  color: #fff;
}

.processing_desc {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(22px);
  font-weight: 400;
  margin-bottom: px-to-rem(32px);
}

.processing_desc_light {
  color: #000;
}
</style>
