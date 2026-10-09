<template>
  <f-button-success-pay
    v-if="show"
    :disabled="form.state.disabled"
    @click="form.submit"
  />
</template>

<script>
import FButtonSuccessPay from '@/components/button/button-success-pay'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButtonSuccessPay,
  },
  inject: ['form'],
  computed: {
    ...mapState('options', { show: 'show_pay_button' }),
  },
}
</script>
