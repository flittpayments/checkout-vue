<template>
  <component
    :is="name"
    ref="item"
    :class="className"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>

<script>
import FFormItemInput from '@/components/form/item/input'
import FFormItemDate from '@/components/form/item/date'
import FFormItemSelect from '@/components/form/item/select'
import FFormItemSelect2 from '@/components/form/item/select2'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FFormItemInput,
    FFormItemDate,
    FFormItemSelect,
    FFormItemSelect2,
  },
  inheritAttrs: false,
  props: {
    component: makeProp(PROP_TYPE_STRING, 'input', value =>
      arrayIncludes(['input', 'date', 'select', 'select2'], value)
    ),
  },
  computed: {
    name() {
      return 'f-form-item-' + this.component
    },
    className() {
      return [
        'f-form-item-' + this.component,
        {
          ['f-form-item-' + this.$attrs.size]: this.$attrs.size,
        },
      ]
    },
  },
  methods: {
    focused() {
      this.$refs.item.focused()
    },
  },
}
</script>
