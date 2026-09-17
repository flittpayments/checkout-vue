<template>
  <f-alert-storage name="show_gdpr_frame" @ok="ok">
    <div class="f-mb-16">
      <span v-text="$t('gdpr_alert_text')" />&nbsp;
      <f-link variant="secondary" @click="$refs.text.show()">{{
        $t('learn_more')
      }}</f-link>
      <f-modal-wrapper ref="text">
        <!--$t('gdpr_modal_text')-->
        <i18n path="gdpr_modal_text">
          <template #privacy_policy>
            <f-link
              variant="secondary"
              :href="$t('privacy_policy_url')"
              target="_blank"
              >{{ $t('privacy_policy') }}</f-link
            >
          </template>
        </i18n>
      </f-modal-wrapper>
    </div>

    <f-form-base>
      <f-form-group
        v-model="save_card"
        class="f-mb-0"
        name="save_card"
        component="checkbox"
        variant="secondary"
      >
        <span v-text="$t('remember_card_for_quick_re_payment')" />&nbsp;
        <f-link variant="secondary" @click="$refs.safe.show()">{{
          $t('its_safe')
        }}</f-link>
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
import FLink from '@/components/link'
import FModalWrapper from '@/components/modal/modal-wrapper'
import FFormBase from '@/components/form/form/form-base'
import SvgSafe from '@/svg/safe.svg'

import { mapStateGetSet, localStorage } from '@/utils/store'

export default {
  components: {
    FAlertStorage,
    FLink,
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
</style>
