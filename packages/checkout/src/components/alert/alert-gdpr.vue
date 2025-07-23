<template>
  <f-alert-storage name="show_gdpr_frame" @ok="ok">
    <div :class="$style.mb_16">
      <span v-text="$t('gdpr_alert_text')" />&nbsp;
      <a href="#" @click="$refs.text.show()" v-text="$t('learn_more')" />
      <f-modal-wrapper ref="text"
        ><span v-html="$t('gdpr_modal_text')"
      /></f-modal-wrapper>
    </div>

    <f-form-base>
      <f-form-group
        v-model="save_card"
        :class="$style.mb_0"
        name="save_card"
        component="checkbox"
        variant="secondary"
      >
        <span v-text="$t('remember_card_for_quick_re_payment')" />&nbsp;
        <a href="#" @click="$refs.safe.show()" v-text="$t('its_safe')" />
      </f-form-group>
    </f-form-base>

    <f-modal-wrapper ref="safe" size="lg" :title="$t('gdpr_modal_safe_title')">
      <template #image>
        <svg-safe :class="$style.svg" />
      </template>

      <div v-html="$t('gdpr_modal_safe')" />
    </f-modal-wrapper>
  </f-alert-storage>
</template>

<script>
import FAlertStorage from '@/components/alert/alert-storage'
import FModalWrapper from '@/components/modal/modal-wrapper'
import FFormBase from '@/components/form/form/form-base'
import SvgSafe from '@/svg/safe.svg'

import { mapStateGetSet, localStorage } from '@/utils/store'

export default {
  components: {
    FAlertStorage,
    FModalWrapper,
    FFormBase,
    SvgSafe,
  },
  computed: {
    ...mapStateGetSet('params', ['save_card']),
  },
  methods: {
    ok() {
      localStorage.set('save_card', this.save_card)
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}

.mb_16 {
  margin-bottom: px-to-rem(16px);
}

.mb_0 {
  margin-bottom: 0;
}
</style>
