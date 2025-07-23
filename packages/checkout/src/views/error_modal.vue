<template>
  <f-modal v-bind="attrs">
    <template #image>
      <svg-decline :class="$style.svg" />
    </template>

    <p :class="$style.text_center" v-text="$t(`${$route.query.error}_text`)" />
  </f-modal>
</template>

<script>
import FModal from '@/components/modal/modal'
import SvgDecline from '@/svg/decline.svg'

export default {
  components: {
    FModal,
    SvgDecline,
  },
  computed: {
    attrs() {
      return {
        noCloseOnEsc: true,
        noCloseOnBackdrop: true,
        noHeaderClose: true,
        title: this.$t(`${this.$route.query.error}_title`),
      }
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}

.text_center {
  text-align: center;
}
</style>
