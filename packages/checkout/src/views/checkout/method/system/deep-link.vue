<template>
  <div>
    <div
      :class="$uiClass('title')"
      v-text="$t('confirm_details_in_app', { name: info.name })"
    />
    <f-button
      :href="link"
      tag="a"
      variant="success"
      size="lg"
      block
      :text="$t('open_mobile_app', { name: info.name })"
      @click="click"
    />
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButton,
  },
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
  },
  methods: {
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
