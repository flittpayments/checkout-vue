<template>
  <f-box-more>
    <f-form-group
      :value="rememberMe"
      name=""
      component="checkbox"
      @input="input"
    >
      <div>{{ $t('skip_verification_next_time') }}</div>
    </f-form-group>
    <template #more>
      <!--$t('skip_verification_next_time_desc')-->
      <i18n path="skip_verification_next_time_desc">
        <template #cookie_notice>
          <a :href="cookieNoticeUrl" target="_blank">{{
            $t('cookie_notice')
          }}</a>
        </template>
      </i18n>
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
