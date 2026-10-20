<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <f-select
      ref="input"
      v-model="innerValue"
      :class="className"
      v-bind="attrs"
      :variant="variant"
      v-on="$listeners"
    >
      <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </f-select>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import FSelect from '@/components/form/item/helpers/select'
import { itemMixin } from '@/mixins/item'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  components: {
    ValidationProvider,
    FSelect,
  },
  mixins: [itemMixin],
  props: {
    noLabelFloating: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    className() {
      return [
        {
          'f-select-no-floating': this.noLabelFloating,
          'f-select-floating': !this.noLabelFloating,
        },
        this.classInput,
      ]
    },
  },
}
</script>
