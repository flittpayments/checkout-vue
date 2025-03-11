<template>
  <f-fields v-if="show" />
</template>

<script>
import { InputText, InputHidden, InputAmount } from '@/import'
import { mapState } from '@/utils/store'
import { select } from '@/utils/dom'

const id = '#f-fields'

export default {
  components: {
    FFields: {
      template: id,
      components: {
        InputText,
        InputHidden,
        InputAmount,
      },
    },
  },
  computed: {
    ...mapState(['fields_custom']),
    show() {
      return !this.fields_custom.length && select(id)
    },
  },
}
</script>
