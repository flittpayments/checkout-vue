<template>
  <div>
    <div :class="$style.row">
      <f-row
        v-model="promocode"
        :class="$style.input"
        :placeholder="$t('enter_promo_code')"
        size="44"
        :disabled="disabledInput"
      />
      <f-button-default
        :text="$t('add')"
        :disabled="disabledButton"
        data-e2e-btn-promo-code
        @click="add"
      />
    </div>
    <div v-if="status" :class="classMessage">{{ message }}</div>
  </div>
</template>

<script>
import FRow from '@/components/input/row'
import FButtonDefault from '@/components/button/button-default'
import { errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'

export default {
  components: {
    FRow,
    FButtonDefault,
  },
  data() {
    return {
      promocode: '',
      loading: false,
      status: '',
    }
  },
  computed: {
    ...mapState(['params']),
    message() {
      return this.$t(`promo_status_${this.status}`)
    },
    classMessage() {
      return [
        this.$style.message,
        {
          [this.$style[this.status]]: this.status,
        },
      ]
    },
    isApprove() {
      return this.status === 'approve'
    },
    disabledInput() {
      return this.$meta.noFeeCalc || this.isApprove
    },
    disabledButton() {
      return this.$meta.noFeeCalc || this.isApprove || !this.promocode
    },
  },
  methods: {
    add() {
      if (this.loading) return
      this.loading = true

      this.store
        .feeCalc({ promocode: this.promocode })
        .then(this.complete)
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
    complete(model) {
      this.status = model.attr('promo_status')

      if (this.isApprove) {
        this.params.promocode = this.promocode
      }
    },
  },
}
</script>

<style lang="scss" module>
.row {
  display: flex;
}

.input {
  margin-right: px-to-rem(8px);
  margin-bottom: 0;
}

.message {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  margin-top: px-to-rem(4px);
}

.invalid {
  color: #de4761;
}
.expired {
  color: #de4761;
}

.approve {
  color: #08a835;
}
</style>
