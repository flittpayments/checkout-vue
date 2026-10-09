<template>
  <f-modal-wrapper v-bind="attrs">
    <template #image>
      <svg-click2pay-circle :class="$style.svg" />
    </template>
    <div :class="$style.box">
      <svg-click2pay-about />
    </div>
    <ul :class="$style.desc" v-html="$t('c2p_about_desc')" />
    <div :class="$style.center">
      <svg-click2pay-visa-mastercard :class="$style.icon" />
    </div>
  </f-modal-wrapper>
</template>

<script>
import FModalWrapper from '@/components/modal/modal-wrapper'
import SvgClick2payCircle from '@/svg/click2pay-circle.svg'
import SvgClick2payAbout from '@/svg/click2pay-about.svg'
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'

export default {
  components: {
    FModalWrapper,
    SvgClick2payCircle,
    SvgClick2payAbout,
    SvgClick2payVisaMastercard,
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'modal',
        title: this.$t('c2p_how_does_work'),
      }
    },
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin-bottom: px-to-rem(12px);
}

.box {
  text-align: center;
  margin-bottom: px-to-rem(16px);
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  color: #5a6470;
  margin-bottom: px-to-rem(16px);
}

.center {
  text-align: center;
}

.icon {
  min-width: px-to-rem(100px);
  color: #1434cb;
}
</style>
