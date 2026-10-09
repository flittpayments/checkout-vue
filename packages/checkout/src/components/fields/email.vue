<template>
  <f-preloader :condition="show_email" class="f-mb-16">
    <f-form-save v-slot="{ input }" name="params" :includes="['email']">
      <f-form-group
        v-bind="$attrs"
        v-model.trim="email"
        input-class="f-checkout-email"
        name="email"
        :rules="rules"
        autocomplete="email"
        @input="input('email', $event)"
      />
    </f-form-save>
  </f-preloader>
</template>

<script>
import FPreloader from '@/components/preloader'
import FFormSave from '@/components/form/form/form-save'
import { rulesEmail, rulesEmailRequiredOne } from '@/config/customer-fields'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FPreloader,
    FFormSave,
  },
  computed: {
    ...mapState(['need_validate_card']),
    ...mapState('options', ['show_email']),
    ...mapStateGetSet('params', ['email']),
    ...mapState('info', ['required_one_of_checkout_customer_fields']),
    rules() {
      return this.need_validate_card
        ? this.required_one_of_checkout_customer_fields
          ? rulesEmailRequiredOne
          : rulesEmail
        : ''
    },
  },
}
</script>
