<template>
  <div v-if="verification_type">
    <div class="f-merchant-name" v-text="$t('verification_t')" />
    <div
      class="f-order-desc"
      v-text="$t(`verification_${verification_type}_d`)"
    />
  </div>
  <div v-else>
    <div v-if="showTitle" class="f-merchant-name" v-text="$t(title)" />
    <div v-if="showLink" class="f-merchant-url">
      <a :href="link" target="_blank">{{ link }}</a>
    </div>
    <f-preloader
      v-if="show_order_desc"
      :condition="order_desc"
      size="20"
      class="f-order-desc"
    >
      <div ref="desc" class="f-order-desc-text" v-text="$t(order_desc)" />
      <f-button-unstyled
        v-if="more"
        class="f-order-desc-more"
        @click="clickMore"
      >
        <span v-text="$t('see_more')" /> <f-svg name="angle-right" />
      </f-button-unstyled>
    </f-preloader>
    <f-modal-base v-model="modalMore" :title="$t('order_details')" size="xl">
      <span v-text="$t(order_desc)" />
    </f-modal-base>
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FModalBase from '@/components/modal/modal-base'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FPreloader,
    FButtonUnstyled,
    FSvg,
    FModalBase,
  },
  mixins: [resizeMixin],
  data() {
    return {
      more: false,
      modalMore: false,
    }
  },
  computed: {
    ...mapState(['order']),
    ...mapState('options', [
      'title',
      'show_title',
      'link',
      'show_link',
      'show_order_desc',
    ]),
    ...mapState('params', ['order_desc', 'verification_type']),
    showTitle() {
      return this.show_title && this.title
    },
    showLink() {
      return this.show_link && this.link
    },
  },
  watch: {
    order_desc() {
      this.$nextTick().then(this.resize)
    },
  },
  mounted() {
    this.resize()
  },
  methods: {
    clickMore() {
      this.modalMore = true
    },
    resize() {
      if (!this.$refs.desc) return

      this.more = false

      if (this.$refs.desc.offsetHeight >= this.$refs.desc.scrollHeight) return

      this.more = true
    },
  },
}
</script>
