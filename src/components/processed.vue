<template>
  <div v-if="full_screen" :class="[$style.wrapper, $style.wrapper_line]">
    <span :class="$style.hr" />
    <span :class="[$style.text, $style.text_line]">
      <span v-text="$t('processed_by')" />&nbsp;
      <span :class="$style.saas" v-text="$t('saas_name')" />
    </span>
  </div>
  <div v-else :class="$style.wrapper">
    <span :class="$style.text" v-text="$t('processed_by')" />
    <svg-logo :class="$style.svg" />
  </div>
</template>

<script>
import SvgLogo from '@/svg/logo.svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    SvgLogo,
  },
  computed: {
    ...mapState('options', ['full_screen']),
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

  :global(.f-theme-light) & {
    background: #eeeeee;
  }

  :global(.f-theme-dark) & {
    background: #45474b;
  }
}

.text {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #747578;
  }

  :global(.f-theme-dark) & {
    color: #a2a3a5;
  }
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
