<template>
  <f-box v-if="show" :class="$style.wrapper" data-e2e-subscription>
    <f-switch
      v-if="show_switch"
      v-model="enabled_switch"
      :class="$style.switch"
      label="subscription"
    />
    <div v-else v-text="$t('subscription')" />
    <transition name="f-collapse">
      <div v-if="enabled_switch" :class="$style.content">
        <input-amount
          name="amount"
          :label="$t('subscription_amount')"
          subscription
          :disabled="readonly"
        />
        <f-form-group
          v-if="showTrial"
          key="trial"
          :value="trial"
          name="trial_period"
          disabled
        />
        <div
          v-if="showQuantity"
          class="f-row"
          :class="$style.align_items_center"
        >
          <f-form-group
            v-if="unlimited"
            key="checked_unlimited"
            value="∞"
            class="f-col-12 f-col-ss-7"
            name="number_of_payments"
            disabled
          />
          <f-form-group
            v-else
            key="quantity"
            v-model.number="quantity"
            class="f-col-12 f-col-ss-7"
            name="number_of_payments"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
          />
          <f-row-checkbox
            v-if="showUnlimited"
            key="unlimited"
            v-model="unlimited"
            class="f-col"
            :disabled="readonly"
            size="sm"
            label="unlimited"
          />
        </div>
        <f-input-group no-margin>
          <f-form-group
            v-model.number="every"
            class="f-col-4"
            name="subscription_every"
            rules="required|numeric|one"
            type="tel"
            inputmode="numeric"
            :disabled="readonly"
            hide-error
            @error="onShowError"
          />
          <f-form-group
            v-model="period"
            component="select"
            class="f-col"
            :options="list"
            name="subscription_period"
            rules="required"
            :disabled="readonly"
            hide-error
            @error="onShowError"
          />
        </f-input-group>
        <div :class="$style.mb_16">
          <f-error :show="!!error">{{ error }}</f-error>
        </div>
        <f-row
          v-if="showStartTime"
          v-model="start_time"
          type="date"
          label="subscription_start_time"
          rules="required"
          :disabled="readonly"
          min="now"
        />
        <f-row
          v-if="showEndTime"
          v-model="end_time"
          type="date"
          label="subscription_end_time"
          rules="required"
          :disabled="readonly"
          min="now"
        />
        <div
          v-if="showVerificationDesc"
          :class="$style.desc"
          v-text="$t('verification_desc')"
        />
      </div>
    </transition>
  </f-box>
</template>

<script>
import FBox from '@/components/box'
import FSwitch from '@/components/input/item/switch'
import FRowCheckbox from '@/components/input/row-checkbox'
import FInputGroup from '@/components/base/input-group'
import { InputAmount } from '@/import'
import FError from '@/components/base/error'
import FRow from '@/components/input/row'
import { mapState, mapStateGetSet } from '@/utils/store'
import { parseSelect } from '@/utils/sort'
import { createDate, format } from '@/utils/date'
import { formatServer } from '@/config/date'

export default {
  components: {
    FBox,
    FSwitch,
    FRowCheckbox,
    FInputGroup,
    InputAmount,
    FError,
    FRow,
  },
  data() {
    return {
      error: '',
      quantity_: 0,
      trial_period_: '',
      trial_quantity_: 0,
      start_time_: '',
      end_time_: '',
      start_time_created: '',
    }
  },
  computed: {
    ...mapState('options.subscription', {
      showQuantity: 'quantity',
      optionTrial: 'trial',
    }),
    ...mapState('options.subscription', ['periods', 'readonly']),
    ...mapStateGetSet('options.subscription', ['unlimited']),
    ...mapState('subscription', ['show', 'show_switch']),
    ...mapStateGetSet('subscription', ['enabled_switch']),
    ...mapStateGetSet('params', ['recurring']),
    ...mapStateGetSet('params.recurring_data', [
      'every',
      'start_time',
      'end_time',
      'quantity',
      'trial_period',
      'trial_quantity',
      'period',
    ]),
    ...mapState('params', ['amount']),
    ...mapState('options', ['amount_readonly']),
    showTrial() {
      return this.optionTrial && !this.unlimited
    },
    showUnlimited() {
      return !this.readonly
    },
    showStartTime() {
      return this.unlimited || this.start_time
    },
    showEndTime() {
      return (
        (this.unlimited && !this.start_time_created && !this.readonly) ||
        this.end_time
      )
    },
    showVerificationDesc() {
      return this.showTrial && this.amount <= 100 && this.amount_readonly
    },
    trial() {
      return this.trial_quantity + ' ' + this.trial_period
    },
    list() {
      return this.periods.map(parseSelect)
    },
  },
  watch: {
    enabled_switch: 'watchEnable',
    unlimited: 'watchUnlimited',
  },
  created() {
    this.start_time_created = this.start_time
    this.setStartTime()

    if (!this.optionTrial) {
      this.clearTrial()
    }

    if (!this.showQuantity || this.unlimited) {
      this.clearQuantity()
    }

    this.saveTime()
    this.saveQuantity()
    this.saveTrial()
    this.watchUnlimited(this.unlimited)
  },
  methods: {
    setStartTime() {
      if (!this.start_time && this.unlimited && !this.optionTrial) {
        this.start_time = format(createDate(), formatServer)
      }
    },
    onShowError(error) {
      this.error = error
    },
    watchEnable(value) {
      this.recurring = value ? 'y' : 'n'
    },
    watchUnlimited(value) {
      if (this.readonly) return

      if (value) {
        this.saveQuantity()
        this.saveTrial()
        this.clearQuantity()
        this.clearTrial()
        this.setTime()
      } else {
        this.saveTime()
        this.clearTime()
        this.setQuantity()
        this.setTrial()
      }
    },
    setTime() {
      this.start_time = this.start_time_
      this.end_time = this.end_time_
    },
    setQuantity() {
      this.quantity = this.quantity_
    },
    setTrial() {
      this.trial_period = this.trial_period_
      this.trial_quantity = this.trial_quantity_
    },
    saveTime() {
      this.start_time_ = this.start_time
      this.end_time_ = this.end_time
    },
    saveQuantity() {
      this.quantity_ = this.quantity
    },
    saveTrial() {
      this.trial_period_ = this.trial_period
      this.trial_quantity_ = this.trial_quantity
    },
    clearTime() {
      this.start_time = ''
      this.end_time = ''
    },
    clearQuantity() {
      this.quantity = 0
    },
    clearTrial() {
      this.trial_period = ''
      this.trial_quantity = 0
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-top: px-to-rem(24px);
  margin-bottom: px-to-rem(16px);
}

.switch {
  margin: px-to-rem(4px) 0;
}

.content {
  margin-top: px-to-rem(12px);

  > :last-child {
    margin: 0;
  }
}

.align_items_center {
  align-items: center;
}

.mb_16 {
  margin-bottom: px-to-rem(16px);
}

.desc {
  font-size: px-to-rem(12px);
}
</style>
