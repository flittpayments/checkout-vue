<template>
  <f-form-save v-slot="{ input }" name="params.form" :includes="includes">
    <component
      :is="field.component"
      v-bind="omit(field, ['component'])"
      v-for="field in list"
      :key="field.name"
      v-model="params.form[field.name]"
      @update:model-value="input(field.name, $event)"
    />
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form/form-save'
import FRow from '@/components/input/row'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { omit } from '@/utils/helpers'

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
    omit,
    parse({ label, placeholder, name, type, validate }) {
      const format = (value = '') => value.toLowerCase().replace(/[. ]/g, '_')
      label = format(label)
      placeholder = format(placeholder)

      let noFloating = Boolean(
        (label && placeholder) || (!label && !placeholder)
      )

      if (!label && placeholder) {
        label = placeholder
        placeholder = ''
      }

      return {
        name,
        noFloating,
        label,
        placeholder,
        component: this.getComponent(),
        rules: this.parseValidate(validate),
        autocomplete: 'on',
        type,
      }
    },
    getComponent() {
      return FRow
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
