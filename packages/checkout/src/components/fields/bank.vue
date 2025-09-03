<template>
  <f-form-save v-slot="{ input }" name="params.form" :includes="includes">
    <f-form-group
      v-for="field in list"
      :key="field.name"
      v-bind="field"
      v-model="params.form[field.name]"
      @input="input(field.name, $event)"
    />
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form/form-save'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FFormSave,
  },
  props: {
    fields: makeProp(PROP_TYPE_ARRAY, []),
  },
  computed: {
    ...mapState(['params']),
    list() {
      return this.fields.map(this.parse)
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
  },
  methods: {
    parse({ label, placeholder, name, type, validate }) {
      const format = (value = '') => value.toLowerCase().replace(/[. ]/g, '_')
      label = format(label)
      placeholder = format(placeholder)

      let noLabelFloating = Boolean(
        (label && placeholder) || (!label && !placeholder)
      )

      if (!label && placeholder) {
        label = placeholder
        placeholder = ''
      }

      return {
        name,
        noLabelFloating,
        label,
        placeholder,
        component: type === 'date' ? 'date' : 'input',
        rules: this.parseValidate(validate),
        autocomplete: 'on',
        type,
      }
    },
    parseValidate(validate) {
      if (!validate) return ''

      const map = {
        min_length: 'min',
        max_length: 'max',
      }
      return validate
        .split(';')
        .map(item => {
          let [name] = item.split(':')

          return item.replace(name, map[name] || name)
        })
        .join('|')
    },
  },
}
</script>
