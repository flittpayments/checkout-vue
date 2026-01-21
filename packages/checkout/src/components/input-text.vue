<template>
  <f-row v-bind="attrs" v-model="form[name]" />
</template>

<script>
import FRow from '@/components/input/row'
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FRow,
  },
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    value: makeProp(PROP_TYPE_STRING, ''),
    validate: makeProp(PROP_TYPE_STRING),
    custom: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['params']),
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        rules: this.validate,
      }
    },
    form() {
      return this.custom ? this.params.custom : this.params
    },
  },
  created() {
    // let value = this.form[this.name]
    // // TODO
    // delete this.form[this.name] // if the field value was set via config, remove it to make it reactive
    this.form[this.name] = this.form[this.name] || this.value
  },
}
</script>
