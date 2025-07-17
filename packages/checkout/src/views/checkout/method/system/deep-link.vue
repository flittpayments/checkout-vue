<template>
  <div>
    <div
      :class="$uiClass('title')"
      v-text="$t('confirm_details_in_app', { name: info.name })"
    />
    <f-container>
      <f-button
        v-if="target === '_blank'"
        :href="link"
        target="_blank"
        tag="a"
        variant="success"
        size="lg"
        block
        :text="$t('open_mobile_app', { name: info.name })"
        @click="clickNonBlocking"
      />
      <f-button
        v-else
        :href="link"
        tag="a"
        variant="success"
        size="lg"
        block
        :text="$t('open_mobile_app', { name: info.name })"
        @click="click"
      />
    </f-container>
  </div>
</template>

<script>
import FContainer from '@/components/base/container'
import FButton from '@/components/button/button'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'

export default {
  components: {
    FContainer,
    FButton,
  },
  mixins: [timeoutMixin],
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
    link: makeProp(PROP_TYPE_STRING),
    callback: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    ...mapState(['tabs']),
    info() {
      return this.tabs[this.method][this.system]
    },
    params() {
      return this.info.params || {}
    },
    target() {
      return this.params.app_banking_target
    },
  },
  methods: {
    clickNonBlocking() {
      this.timeout(() => {
        this.sendCallback()
        this.goLoading()
      })
    },
    click() {
      this.sendCallback()
      this.goLoading()
    },
    sendCallback() {
      return this.store.sendRequestBase('api.checkout.deepcallback', 'get', {
        url: this.callback,
      })
    },
    goLoading() {
      this.$router
        .push({
          name: 'loading',
          params: { method: this.method, system: this.system },
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-size: px-to-rem(18px);
  line-height: px-to-rem(26px);
  font-weight: 500;
  margin-bottom: px-to-rem(16px);
}

.title_light {
  color: #000;
}

.title_dark {
  color: #fff;
}
</style>
