<template>
  <div v-if="showText" :class="[$style.wrapper, $style.wrapper_line]">
    <span :class="$uiClass('hr')" />
    <span :class="[$uiClass('text'), $style.text_line]">
      <span data-e2e-processed-text v-text="$t('processed_by')" />&nbsp;
      <span :class="$style.saas" v-text="$t('saas_name')" />
    </span>
  </div>
  <div v-else :class="$style.wrapper">
    <span
      :class="$uiClass('text')"
      data-e2e-processed-text
      v-text="$t('processed_by')"
    />
    <svg-logo :class="$style.svg" />
  </div>
</template>

<script>
import SvgLogo from '@/svg/logo.svg'
import { mapState } from '@/utils/store'
import { logo_url } from '@/config/config-default'

export default {
  components: {
    SvgLogo,
  },
  computed: {
    ...mapState('options', ['full_screen', 'logo_url']),
    showText() {
      return this.full_screen && this.logo_url === logo_url
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: px-to-rem(32px);
}

.wrapper_line {
  position: relative;
  width: px-to-rem(300px);
  margin-right: auto;
  margin-left: auto;
}

.hr {
  position: absolute;
  height: 1px;
  top: 50%;
  left: 0;
  right: 0;
}

.hr_light {
  background: #eeeeee;
}

.hr_dark {
  background: #45474b;
}

.text {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
}

.text_light {
  color: #747578;
}

.text_dark {
  color: #a2a3a5;
}

.text_line {
  position: relative;
  padding: 0 px-to-rem(12px);
  background: $container-bg;
}

.svg {
  height: px-to-rem(18px);
  margin-left: px-to-rem(12px);
}

.saas {
  color: #97a5f9;
  font-weight: 600;
}
</style>
