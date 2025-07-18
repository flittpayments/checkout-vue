<template>
  <transition name="f-fade-enter">
    <f-box v-if="isRegistration">
      <div :class="$style.desc">
        {{ $t('c2p_registration_desc') }}
      </div>
      <f-form v-slot="{ submit, disabled }" @submit="onSubmit">
        <f-input-group>
          <f-calling-codes
            v-model="countryCode"
            class="f-col-4"
            rules="required"
            :disabled="loading"
            @calling-code="onCallingCode"
          />
          <f-form-group
            v-model="phoneNumber"
            class="f-col"
            name="phone_number"
            :label="$t('phone_number')"
            rules="required"
            :disabled="loading"
            :mask="maskPhone"
          />
        </f-input-group>
        <f-form-group
          v-model="lastName"
          name="last_name"
          :label="$t('last_name')"
          rules="required"
          :disabled="loading"
          :mask="maskLatinCyrillicWord"
        />
        <f-form-group
          v-model="firstName"
          name="first_name"
          :label="$t('first_name')"
          rules="required"
          :disabled="loading"
          :mask="maskLatinCyrillicWord"
        />
        <click2pay-remember-me :class="$style.mb_16" />
        <div v-if="error" :class="$style.error" v-text="$t(error)" />
        <f-button-success
          class="f-mb-20"
          :disabled="disabled"
          :loading="loading"
          :text="$t('registration')"
          @click="submit"
        />
      </f-form>
      <div
        :class="$style.agreement"
        v-html="
          $t('c2p_agreement_with_processing_of_data', {
            terms,
            privacy_notice: privacyNotice,
          })
        "
      />
    </f-box>
    <click2pay-loader v-else-if="isLoading" />
    <div
      v-else-if="isRegistered"
      :class="$style.registered"
      v-text="$t('c2p_card_add')"
    />
    <div
      v-else-if="isExpired"
      :class="$style.expired"
      v-text="$t('c2p_card_add_expired')"
    />
  </transition>
</template>

<script>
import FBox from '@/components/box'
import FForm from '@/components/form/form/form'
import FInputGroup from '@/components/base/input-group'
import FCallingCodes from '@/components/calling-codes'
import Click2payRememberMe from '@/views/click2pay/remember-me'
import FButtonSuccess from '@/components/button/button-success'
import Click2payLoader from '@/views/click2pay/loader'
import { checkout } from '@/click2pay'
import { mapState } from '@/utils/store'
import { maskLatinCyrillicWord, maskPhone } from '@/config/mask'
import { coinsToAmountString } from '@/utils/helpers'

export default {
  components: {
    FBox,
    FForm,
    FInputGroup,
    FCallingCodes,
    Click2payRememberMe,
    FButtonSuccess,
    Click2payLoader,
  },
  data() {
    return {
      status: 'registration',
      loading: false,
      countryCode: '',
      callingCode: '',
      phoneNumber: '',
      lastName: '',
      firstName: '',
      error: '',
      maskLatinCyrillicWord: maskLatinCyrillicWord,
      maskPhone: maskPhone,
    }
  },
  computed: {
    ...mapState('options', ['title']),
    ...mapState('click2pay', ['email']),
    ...mapState('info', ['country_user_by_ip', 'click2pay']),
    ...mapState('order', ['order_data']),
    isRegistration() {
      return this.status === 'registration'
    },
    isLoading() {
      return this.status === 'loading'
    },
    isRegistered() {
      return this.status === 'registered'
    },
    isExpired() {
      return this.status === 'expired'
    },
    terms() {
      return `<a href="${this.termsUrl}" target="_blank">${this.$t('terms')}</a>`
    },
    termsUrl() {
      return this.$t('c2p_terms_url')
    },
    privacyNotice() {
      return `<a href="${this.privacyNoticeUrl}" target="_blank">${this.$t('privacy_notice')}</a>`
    },
    privacyNoticeUrl() {
      return this.$t('c2p_privacy_notice_url')
    },
  },
  created() {
    this.countryCode = this.country_user_by_ip
  },
  methods: {
    onSubmit() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      this.store
        .click2payCardEncrypt({
          first_name: this.firstName,
          last_name: this.lastName,
        })
        .then(({ encryptedCard, firstName, lastName }) => {
          const {
            currency: transactionCurrencyCode,
            order_id: merchantOrderId,
          } = this.order_data
          const {
            merchantCategoryCode,
            acquirerBIN,
            authenticationMethodType,
            challengeIndicator,
          } = this.click2pay

          return checkout({
            encryptedCard,
            consumer: {
              countryCode: this.countryCode,
              locale: 'en',
              firstName,
              lastName,
              fullName: `${firstName} ${lastName}`,
              mobileNumber: {
                countryCode: this.callingCode,
                phoneNumber: this.phoneNumber,
              },
              consumerIdentity: {
                identityProvider: 'SRC',
                identityType: 'EMAIL_ADDRESS',
                identityValue: this.email,
              },
            },
            dpaTransactionOptions: {
              transactionAmount: {
                transactionAmount: coinsToAmountString(
                  this.order_data.actual_amount
                ),
                transactionCurrencyCode,
              },
              merchantCategoryCode,
              merchantOrderId,
              merchantName: this.title,
              acquirerBIN,
              acquirerMerchantId: String(this.order_data.merchant_id),
              authenticationPreferences: {
                authenticationMethods: [
                  {
                    authenticationMethodType,
                    methodAttributes: {
                      challengeIndicator,
                    },
                  },
                ],
              },
            },
          })
            .finally(() => {
              this.loading = false
            })
            .then(() => {
              this.status = 'registered'
            })
            .catch(error => {
              this.error = error
            })
        })
        .catch(() => {
          this.status = 'expired'
        })
    },
    onCallingCode(value) {
      this.callingCode = value
    },
  },
}
</script>

<style lang="scss" module>
.desc {
  font-size: px-to-rem(16px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(12px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.agreement {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.registered {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #08a835;
}

.expired {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #de4761;
}

.mb_16 {
  margin-bottom: px-to-rem(16px);
}
</style>
