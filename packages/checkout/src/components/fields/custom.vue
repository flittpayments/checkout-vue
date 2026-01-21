<template>
  <f-form-save
    v-if="show"
    v-slot="{ input }"
    name="params.custom"
    :includes="includes"
  >
    <component
      :is="field.component"
      v-bind="omit(field, ['component'])"
      v-for="field in list"
      :key="field.name"
      v-model="params.custom[field.name]"
      @update:model-value="input(field.name, $event)"
    />
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form/form-save'
import { InputHidden } from '@/import'
import FRowCheckbox from '@/components/input/row-checkbox'
import FRow from '@/components/input/row'
import { mapState } from '@/utils/store'
import { omit } from '@/utils/helpers'

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
      this.params.custom[name] = value
    })
  },
  methods: {
    omit,
    parse({
      value = '',
      name,
      label,
      placeholder,
      type,
      hidden,
      required,
      valid = {},
      readonly,
    }) {
      const component = this.getComponent(hidden, type)
      const noFloating = Boolean(
        (label && placeholder) || (!label && !placeholder)
      )

      if (!label && placeholder) {
        label = placeholder
        placeholder = ''
      }

      const props = {
        value,
        name,
        noFloating,
        label,
        placeholder,
        component,
        type,
        rules: this.parseValidate(required, valid),
        autocomplete: 'on',
        readonly,
        disabled: readonly,
      }

      if (component === InputHidden) {
        props.custom = true
      }

      return props
    },
    getComponent(hidden, type) {
      if (hidden) return InputHidden
      if (type === 'checkbox') return FRowCheckbox

      return FRow
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
