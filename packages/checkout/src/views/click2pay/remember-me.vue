<template>
  <f-box-more>
    <f-form-group
      :value="rememberMe"
      name=""
      component="checkbox"
      @input="input"
    >
      <div v-html="$t('skip_verification_next_time')" />
    </f-form-group>
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
import { getRememberMe, setRememberMe } from '@/click2pay'

export default {
  components: {
    FBoxMore,
  },
  data() {
    return {
      rememberMe: getRememberMe(),
    }
  },
  computed: {
    cookieNotice() {
      return `<a href="${this.cookieNoticeUrl}" target="_blank">${this.$t('cookie_notice')}</a>`
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
