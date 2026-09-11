<template>
  <f-box-more>
    <f-row-checkbox :value="rememberMe" @input="input">
      <div>{{ $t('skip_verification_next_time') }}</div>
    </f-row-checkbox>
    <template #more>
      <!--$t('skip_verification_next_time_desc')-->
      <i18n path="skip_verification_next_time_desc" tag="span">
        <template #cookie_notice>
          <a :href="cookieNoticeUrl" target="_blank" rel="noopener noreferrer">
            {{ $t('cookie_notice') }}
          </a>
        </template>
      </i18n>
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
