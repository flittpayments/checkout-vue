<template>
  <f-box-more>
    <f-row-checkbox :value="rememberMe" @input="input">
      <div>{{ $t('skip_verification_next_time') }}</div>
    </f-row-checkbox>
    <template #more>
      <!--$t('skip_verification_next_time_desc')-->
      <i18n-t keypath="skip_verification_next_time_desc">
        <template #cookie_notice>
          <f-link variant="secondary" :href="cookieNoticeUrl" target="_blank">{{
            $t('cookie_notice')
          }}</f-link>
        </template>
      </i18n-t>
    </template>
  </f-box-more>
</template>

<script>
import FBoxMore from '@/components/box-more'
import FRowCheckbox from '@/components/input/row-checkbox'
import I18nT from '@/components/base/i18n-t'
import FLink from '@/components/link'
import { getRememberMe, setRememberMe } from '@/click2pay'

export default {
  components: {
    FBoxMore,
    FRowCheckbox,
    I18nT,
    FLink,
  },
  data() {
    return {
      rememberMe: getRememberMe(),
    }
  },
  computed: {
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
