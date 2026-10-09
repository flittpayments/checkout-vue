<template>
  <f-row v-bind="attrs" data-e2e-country @search="onSearch">
    <template #text="{ item }">
      <span :class="$style.mr_4">{{ flag(item.value) }}</span>
      {{ item.text }}
    </template>
    <template #item="{ item, isActive }">
      <span :class="$style.mr_8">{{ flag(item.value) }}</span>
      {{ item.text }}
      <f-svg v-if="isActive" :class="$style.ml_auto" name="check" size="lg" />
    </template>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import FSvg from '@/components/svg'
import { codeToFlag } from '@/utils/helpers'
import { countriesSearch } from '@/import'
import { sort, parseSelect } from '@/utils/sort'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'

export default {
  components: {
    FRow,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    value: makeProp(PROP_TYPE_STRING),
    list: makeProp(PROP_TYPE_ARRAY, []),
    setFirst: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  emits: ['input'],
  data() {
    return {
      search: '',
      countriesSearch: null,
    }
  },
  computed: {
    flag() {
      return code => codeToFlag(code)
    },
    attrs() {
      return {
        ...this.$attrs,
        value: this.value,
        options: this.options,
        variantItem: 'secondary',
        type: 'select',
        search: true,
        filter: this.filter,
        dropdownSize: 'lg',
        disabled: this.disabled,
      }
    },
    options() {
      return this.list
        .map(parseSelect)
        .map(item => ({
          ...item,
          order:
            this.search && this.countriesSearch
              ? this.countriesSearch[item.value].reduce(
                  (accum, value) =>
                    value.toLowerCase().indexOf(this.search) === 0
                      ? accum + 1
                      : accum,
                  0
                )
              : 0,
        }))
        .sort(this.search ? sort('order', true) : sort('text'))
    },
    disabled() {
      return this.options.length === 1
    },
  },
  created() {
    this.load()
    this.setCountry()
  },
  methods: {
    load() {
      if (this.list.length <= 10) return

      countriesSearch().then(({ countriesSearch }) => {
        this.countriesSearch = countriesSearch
      })
    },
    filter(search) {
      return ({ value, text }) =>
        this.countriesSearch
          ? this.countriesSearch[value].some(
              text => text.toLowerCase().indexOf(search) === 0
            )
          : text.toLowerCase().indexOf(search) === 0
    },
    onSearch(value) {
      this.search = value
    },
    setCountry() {
      if (!this.setFirst) return
      if (this.list.includes(this.value)) return

      if (this.options.length > 0) {
        this.$emit('input', this.options[0].value)
      }
    },
  },
}
</script>

<style lang="scss" module>
.mr_4 {
  margin-right: px-to-rem(4px);
}

.mr_8 {
  margin-right: px-to-rem(8px);
}

.ml_auto {
  margin-left: auto;
}
</style>
