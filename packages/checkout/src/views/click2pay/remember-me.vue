<template>
  <f-box-more>
    <f-row-checkbox :value="rememberMe" @input="input">
      <div v-html="$t('skip_verification_next_time')" />
    </f-row-checkbox>
    <template #more>
      <span
        v-html="
          $t('skip_verification_next_time_desc', {
            cookie_notice: cookieNotice,
          })
        "
      />
    </template>
  </f-box-more>
</template>

<script>
import FBoxMore from '@/components/box-more'
import FRowCheckbox from '@/components/input/row-checkbox'
import { getRememberMe, setRememberMe } from '@/click2pay'

export default {
  components: {
    FBoxMore,
    FRowCheckbox,
  },
  data() {
    return {
      rememberMe: getRememberMe(),
    }
  },
  computed: {
    cookieNotice() {
      return `<a href="${this.cookieNoticeUrl}" target="_blank">${this.$t(
        'cookie_notice'
      )}</a>`
    },
    cookieNoticeUrl() {
      return this.$t('c2p_cookie_notice_url')
    },
  },
  methods: {
    input(value) {
      this.rememberMe = value
      setRememberMe(value)
    },
  },
}
</script>
