<template>
  <f-form-save
    v-if="show"
    v-slot="{ input }"
    name="params.custom"
    :includes="includes"
  >
    <component
      :is="field.componentName"
      v-for="field in list"
      :key="field.name"
      v-bind="field"
      v-model="params.custom[field.name]"
      @input="input(field.name, $event)"
    />
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form/form-save'
import { InputHidden } from '@/import'
import FRowCheckbox from '@/components/input/row-checkbox'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFormSave,
  },
  computed: {
    ...mapState(['params', 'fields_custom']),
    show() {
      return this.list.length
    },
    list() {
      return this.fields_custom.map(this.parse)
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
  },
  created() {
    this.list.forEach(({ name, value }) => {
      this.$set(this.params.custom, name, value)
    })
  },
  methods: {
    parse({
      value = '',
      name,
      label,
      placeholder,
      type = 'input',
      hidden,
      required,
      valid = {},
      readonly,
    }) {
      let noLabelFloating = Boolean(
        (label && placeholder) || (!label && !placeholder)
      )

      if (!label && placeholder) {
        label = placeholder
        placeholder = ''
      }

      return {
        value,
        name,
        noLabelFloating,
        label,
        placeholder,
        componentName: this.getComponent(hidden, type),
        component: type,
        custom: true,
        rules: this.parseValidate(required, valid),
        autocomplete: 'on',
        readonly,
        disabled: readonly,
      }
    },
    getComponent(hidden, type) {
      if (hidden) return InputHidden
      if (type === 'checkbox') return FRowCheckbox

      return 'f-form-group'
    },
    parseValidate(required, { pattern, min_length, max_length }) {
      let rules = {}

      if (required) rules.required = required
      if (pattern) rules.regex = pattern
      if (min_length) rules.min = min_length
      if (max_length) rules.max = max_length

      return rules
    },
  },
}
</script>
