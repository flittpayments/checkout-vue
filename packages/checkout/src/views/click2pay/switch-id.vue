<template>
  <div>
    <click2pay-header :class="$style.mb_16" :email-short="emailShort" />

    <f-box>
      <h3 :class="$uiClass('h3')" v-text="$t('another_user')" />
      <div
        :class="$uiClass('desc')"
        v-text="$t('enter_another_email_to_download_set_of_stored_cards')"
      />
      <f-form
        v-slot="{ submit, disabled }"
        :class="$style.mb_4"
        @submit="onSubmit"
      >
        <f-row
          v-model="email"
          type="email"
          label="email"
          rules="required|email"
        />
        <div v-if="error" :class="$style.error" v-text="$t(error)" />
        <f-button-success
          :disabled="disabled"
          :loading="loading"
          :text="$t('change_user')"
          @click="submit"
        />
      </f-form>
      <f-button-link block size="56" @click="goCard">{{
        $t('cancel')
      }}</f-button-link>
    </f-box>
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import { getCards, switchUser } from '@/click2pay'
import FBox from '@/components/box'
import FForm from '@/components/form/form/form'
import FRow from '@/components/input/row'
import FButtonSuccess from '@/components/button/button-success'
import FButtonLink from '@/components/button/button-link'

export default {
  components: {
    Click2payHeader,
    FBox,
    FForm,
    FRow,
    FButtonSuccess,
    FButtonLink,
  },
  data() {
    return {
      emailShort: '',
      email: '',
      loading: false,
      error: '',
    }
  },
  created() {
    getCards()
      .then(({ profiles }) => {
        this.emailShort = profiles[0].maskedConsumer.maskedEmailAddress
      })
      .catch(() => {})
  },
  methods: {
    goCard() {
      this.$router.push({ name: 'card' }).catch(() => {})
    },
    onSubmit() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      switchUser(this.email)
        .finally(() => {
          this.loading = false
        })
        .then(([actionCode, name]) => {
          this.store.setClick2payEmail(this.email)
          this.store.setClick2payActionCode(actionCode)
          this.store.state.params.email = this.email

          this.$router.push({ name }).catch(() => {})
        })
        .catch(error => {
          this.store.setClick2payActionCode('')
          this.error = error
        })
    },
  },
}
</script>

<style lang="scss" module>
.mb_16 {
  margin-bottom: px-to-rem(16px);
}

.h3 {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 600;
  margin-bottom: px-to-rem(4px);
}

.h3_light {
  color: #3d3d3d;
}

.desc {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(20px);
}

.desc_light {
  color: #5a6470;
}

.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.mb_4 {
  margin-bottom: px-to-rem(4px);
}
</style>
