<template>
  <f-modal v-if="isCodeMessage" v-bind="$attrs" :title="$t('declined')">
    <template #image>
      <svg-decline :class="$style.svg" />
    </template>
    <p>
      <b>{{ code }}</b> {{ message }}
    </p>
  </f-modal>
  <f-modal v-else v-bind="$attrs" :title="$t('server_trouble_title')">
    <template #image>
      <svg-server-trouble :class="$style.svg" />
    </template>

    <p v-text="$t('server_trouble_desc')" />
  </f-modal>
</template>

<script>
import FModal from '@/components/modal/modal'
import SvgServerTrouble from '@/svg/server-trouble.svg'
import SvgDecline from '@/svg/decline.svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    FModal,
    SvgServerTrouble,
    SvgDecline,
  },
  computed: {
    ...mapState('error', ['code', 'message']),
    isCodeMessage() {
      return this.code || this.message
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}
</style>
