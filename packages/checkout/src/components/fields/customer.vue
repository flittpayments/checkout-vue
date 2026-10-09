<template>
  <f-form-save
    v-if="show"
    v-slot="{ input }"
    name="params.customer_data"
    :includes="includes"
  >
    <component
      :is="field.component"
      v-bind="omit(field, ['component'])"
      v-for="field in list"
      :key="field.name"
      v-model="params.customer_data[field.name]"
      @update:model-value="input(field.name, $event)"
    />
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form-save'
import { FCountry } from '@/import'
import FRow from '@/components/input/row'
import { configCustomer } from '@/config/customer-fields'
import countries from '@/i18n/countries/en.json'
import { mapState } from '@/utils/store'
import { omit } from '@/utils/helpers'

export default {
  components: {
    FFormSave,
  },
  inject: ['form'],
  computed: {
    ...mapState('options', ['show_email']),
    ...mapState(['params', 'fields_customer']),
    ...mapState('info', ['required_one_of_checkout_customer_fields']),
    show() {
      return this.list.length
    },
    config() {
      let result = { ...configCustomer }
      if (this.required_one_of_checkout_customer_fields) {
        result.phonemobile.rules = {
          required_one: [this.form.values.email],
          phonemobile: true,
        }

        result.email.rules = {
          required_one: [this.form.values.phonemobile],
          email: true,
        }
      }
      return result
    },
    list() {
      return this.fields_customer
        .filter(name => name !== 'email' || !this.show_email)
        .filter(name => this.config[name])
        .map(this.parse)
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
  },
  methods: {
    omit,
    parse(name) {
      const component = this.getComponent(name)
      const props = {
        ...this.config[name],
        component,
        name,
      }

      if (component === FCountry) {
        props.list = Object.keys(countries)
      }

      return props
    },
    getComponent(name) {
      if (name === 'customer_country') return FCountry

      return FRow
    },
  },
}
</script>
