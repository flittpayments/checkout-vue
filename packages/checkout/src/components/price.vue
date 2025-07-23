<template>
  <div v-if="show" :class="$style.wrapper">
    <f-preloader :condition="showAmount" :size="sizePreloader">
      <template v-if="isTrialPeriod">
        <span v-text="$t('trial_period')" />: {{ trial_quantity }}
        {{ trial_period }}
      </template>
      <template v-else-if="isFirstPayment">
        <template v-if="start_time">
          <span v-text="$t('first_payment')" />:
          <f-date :value="start_time" />
        </template>
      </template>
      <template v-else>
        <f-promo v-if="showPromoTop" :class="$style.mb_12" />
        <template v-if="showAmountReadOnly">
          <f-amount
            :value="total_amount"
            :currency="currency"
            :amount-class="$style.amount"
            :currency-class="$style.currency"
            sup
          />
        </template>
        <template v-else>
          <input-amount v-slot="{ id }" name="amount" label="amount">
            <f-placeholder
              v-if="showFeeAmount"
              :id="id"
              :value="totalAmount"
              :offset="5"
              :name-class="['f-form-control']"
              :text-class="$style.fee"
            >
              + <f-amount :value="fee_amount" />
            </f-placeholder>
          </input-amount>
        </template>
        <table v-if="showFee">
          <tr>
            <td :class="$style.pr_16" v-text="$t('amount')" />
            <td><f-amount :value="actualAmount" no-bold /></td>
          </tr>
          <tr v-if="showDiscount">
            <td :class="$style.pr_16" v-text="$t('discount')" />
            <td>
              <f-percent v-if="discount_percent" :value="discount_percent" />
              <span v-if="discount_percent && discount_amount"> + </span>
              <f-amount
                v-if="discount_amount"
                :value="discount_amount"
                no-bold
              />
            </td>
          </tr>
          <tr v-if="fee_amount">
            <td :class="$style.pr_16" v-text="$t('fee')" />
            <td><f-amount :value="fee_amount" no-bold /></td>
          </tr>
          <tr>
            <td :class="$style.pr_16" v-text="$t('total_amount')" />
            <td><f-amount :value="total_amount" no-bold /></td>
          </tr>
        </table>
        <f-promo v-if="showPromoBottom" :class="$style.mt_20" />
      </template>
    </f-preloader>
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import FDate from '@/components/base/date'
import FPlaceholder from '@/components/base/placeholder'
import { InputAmount, FPromo } from '@/import'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { timeoutMixin } from '@/mixins/timeout'
import FPercent from '@/components/base/percent.vue'

export default {
  components: {
    FPercent,
    FPreloader,
    FAmount,
    InputAmount,
    FDate,
    FPlaceholder,
    FPromo,
  },
  mixins: [timeoutMixin],
  props: {
    readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      actualAmount: 0,
      loading: false,
    }
  },
  computed: {
    ...mapState([
      'ready',
      'discount_percent',
      'discount_amount',
      'fee_amount',
      'total_amount',
      'promo',
    ]),
    ...mapState('options', ['amount_readonly', 'show_amount', 'show_fee']),
    ...mapState('params', [
      'currency',
      'amount',
      'verification_type',
      'recurring',
    ]),
    ...mapState('options.subscription', ['trial', 'unlimited']),
    ...mapState('params.recurring_data', [
      'trial_period',
      'trial_quantity',
      'start_time',
    ]),
    showFee() {
      return this.show_fee && (this.showDiscount || this.fee_amount)
    },
    showFeeAmount() {
      return this.showFee && this.actualAmount === this.amount
    },
    showAmountReadOnly() {
      return this.$meta.noFeeCalc || this.amount_readonly || this.readonly
    },
    showAmount() {
      return this.ready || !this.amount_readonly
    },
    showDiscount() {
      return this.discount_percent || this.discount_amount
    },
    showPromoTop() {
      return !this.readonly && this.promo && this.amount_readonly
    },
    showPromoBottom() {
      return !this.readonly && this.promo && !this.amount_readonly
    },
    totalAmount() {
      return this.amount / 100
    },
    sizePreloader() {
      return this.amount_readonly ? '38' : null
    },
    show() {
      return this.show_amount && !this.verification_type
    },
    isSubscription() {
      return this.recurring === 'y'
    },
    isTrial() {
      return this.trial && !this.unlimited
    },
    isTrialPeriod() {
      return (
        this.amount_readonly &&
        !this.total_amount &&
        this.isSubscription &&
        this.isTrial
      )
    },
    isFirstPayment() {
      return (
        this.amount_readonly &&
        !this.total_amount &&
        this.isSubscription &&
        !this.isTrial
      )
    },
  },
  watch: {
    amount: 'feeCalc',
    ready: 'setActualAmount',
  },
  mounted() {
    this.setActualAmount()
  },
  methods: {
    feeCalc() {
      if (!this.ready) return

      this.timeout('request', 300)
    },
    request() {
      if (this.loading) return
      this.loading = true

      this.store
        .feeCalc()
        .then(this.setActualAmount)
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
    setActualAmount() {
      this.actualAmount = this.amount
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
  margin-bottom: px-to-rem(24px);
}

.mb_12 {
  margin-bottom: px-to-rem(12px);
}

.amount {
  display: inline-block;
  font-size: px-to-rem(28px);
  line-height: 1.2;
  color: $amount_color;

  @include media-breakpoint-up(ss) {
    font-size: px-to-rem(32px);
  }

  sup {
    font-size: px-to-rem(16px);
  }
}

.currency {
  display: inline-block;
  margin-left: px-to-rem(8px);
  font-size: px-to-rem(20px);
  color: $currency_color;

  @include media-breakpoint-up(ss) {
    font-size: px-to-rem(22px);
  }
}

.fee {
  position: absolute;
  top: px-to-rem(26px);
  z-index: 1;
  font-weight: 500;
  color: $fee_color;
}

.pr_16 {
  padding-right: px-to-rem(16px);
}

.mt_20 {
  margin-top: px-to-rem(20px);
}
</style>
