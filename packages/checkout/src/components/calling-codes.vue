<template>
  <f-row
    v-bind="attrs"
    data-e2e-calling-codes
    @search="onSearch"
    @input="emitCallingCode"
  >
    <template #text="{ item }">
      <template v-if="item.code">
        <span :class="$style.mr_4">{{ flag(item.cca2) }}</span
        >+{{ item.code }}
      </template>
    </template>
    <template #item="{ item, isActive }">
      <span :class="$style.mr_8">{{ flag(item.cca2) }}</span>
      {{ item.text }} (+{{ item.code }})
      <f-svg v-if="isActive" :class="$style.ml_auto" name="check" size="lg" />
    </template>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import { codeToFlag } from '@/utils/helpers'
import { countriesCallingCodes, countriesSearch } from '@/import'
import { sort } from '@/utils/sort'
import FSvg from '@/components/svg'

export default {
  components: {
    FRow,
    FSvg,
  },
  inheritAttrs: false,
  emits: ['calling-code'],
  data() {
    return {
      countriesCallingCodes: {},
      list: [],
      search: '',
    }
  },
  computed: {
    flag() {
      return code => codeToFlag(code)
    },
    attrs() {
      return {
        ...this.$attrs,
        options: this.options,
        variantItem: 'secondary',
        type: 'select',
        search: true,
        filter: this.filter,
        dropdownSize: 'lg',
      }
    },
    options() {
      return this.list
        .map(item => ({
          ...item,
          text: this.$t(item.cca2),
          order:
            this.search && item.search
              ? item.search.reduce(
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
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      Promise.all([countriesCallingCodes(), countriesSearch()]).then(
        ([{ countriesCallingCodes }, { countriesSearch }]) => {
          this.countriesCallingCodes = countriesCallingCodes
          this.emitCallingCode(this.$attrs.value)
          this.list = Object.entries(countriesCallingCodes).map(
            ([cca2, code]) => {
              code = String(code)
              return {
                value: cca2,
                cca2,
                code,
                search: [code, ...countriesSearch[cca2]],
              }
            }
          )
        }
      )
    },
    filter(value) {
      return ({ text, search }) =>
        search
          ? search.some(text => text.toLowerCase().indexOf(value) === 0)
          : text.toLowerCase().indexOf(value) === 0
    },
    onSearch(value) {
      this.search = value
    },
    emitCallingCode(value) {
      const code = String(this.countriesCallingCodes[value])
      this.$emit('calling-code', code)
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
