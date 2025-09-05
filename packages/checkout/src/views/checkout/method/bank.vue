<template>
  <transition name="f-fade-enter">
    <div v-if="ready" key="1">
      <div v-if="title" :class="$uiClass('title')">{{ title }}</div>
      <div :class="$style.row">
        <div v-if="showCountry" :class="[$style.col_12, $style.country]">
          <f-country
            v-model="default_country"
            :list="listCountry"
            :label="label"
            size="44"
            no-floating
            set-first
            @input="clear"
          />
        </div>
        <div v-if="showSearch" :class="[$style.col_12, $style.search]">
          <f-form-base>
            <f-form-group
              v-model="search"
              name="system_search"
              size="sm"
              prepend="search"
            />
          </f-form-base>
        </div>
        <div v-if="showView" :class="[$style.col_12, $style.view]">
          <div :class="classBankViewBar" @click="setView('bar')">
            <f-svg name="bar" size="lg" />
          </div>
          <div :class="classBankViewList" @click="setView('list')">
            <f-svg name="list" size="lg" />
          </div>
        </div>
      </div>
      <div class="f-row">
        <div v-for="item in listMin" :key="item.id" :class="classItemWrapper">
          <f-button-unstyled :class="classItem" @click="clickItem(item)">
            <f-icon
              :name="item.logo"
              :type="item.method"
              :class="classIcon"
              :size="sizeIcon"
            />
            <div :class="classItemBody">
              <div :class="$style.name" v-text="$t(item.name)" />
              <div v-if="isGermany">
                {{ item.iban }}
              </div>
            </div>
          </f-button-unstyled>
        </div>
      </div>
      <div :class="$style.text_center">
        <f-button v-if="showMore" variant="outline" @click="loadMore">
          <span><f-svg name="redo" size="lg" :spin="spin" fw /></span>
          <span v-text="$t('load_more')" />
        </f-button>
      </div>
    </div>
    <div v-else key="2">
      <div class="f-row">
        <div v-for="item in preloader" :key="item" :class="classItemWrapper">
          <f-progress-bank-item />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import FFormBase from '@/components/form/form/form-base'
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FIcon from '@/components/icon'
import FButton from '@/components/button/button'
import { FCountry } from '@/import'
import FProgressBankItem from '@/components/base/progress-bank-item'
import { sort } from '@/utils/sort'
import { mapState, mapStateGetSet } from '@/utils/store'
import { removeDuplicate } from '@/utils/helpers'
import { timeoutMixin } from '@/mixins/timeout'
import {
  PROP_TYPE_OBJECT,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { resizeMixin } from '@/mixins/resize'
import { upperFirst } from '@/utils/string'
import { isNotButtonOnly } from '@/utils/method'

const SUPPORTED_SYSTEM_ROUTE = [
  'banks',
  'local_methods',
  'loans',
  'emoney',
  'crypto',
  'installments',
]

export default {
  components: {
    FFormBase,
    FButtonUnstyled,
    FSvg,
    FIcon,
    FButton,
    FCountry,
    FProgressBankItem,
  },
  mixins: [timeoutMixin, resizeMixin],
  props: {
    // {147209: {country: 'PL', name: '', logo: 'mbank'}}
    config: makeProp(PROP_TYPE_OBJECT, {}),
    enableCountry: makeProp(PROP_TYPE_BOOLEAN, false),
    breakpoint: makeProp(PROP_TYPE_STRING, 'md'),
    noMore: makeProp(PROP_TYPE_BOOLEAN, false),
    noSearch: makeProp(PROP_TYPE_BOOLEAN, false),
    label: makeProp(PROP_TYPE_STRING, ''),
  },
  data() {
    return {
      search: '',
      counts: 0,
      spin: false,
      view_: 'bar',
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('options', ['countries']),
    ...mapStateGetSet('options', ['default_country']),
    title() {
      // $t('select_bank_to_pay_banks')
      // $t('select_bank_to_pay_installments')
      const key = `select_bank_to_pay_${this.$meta.method}`
      return this.$te(key) ? this.$t(key) : ''
    },
    // [{id: 147209, country: 'PL', name: '', logo: 'mbank'}]
    values() {
      return Object.values(this.config).filter(isNotButtonOnly)
    },
    listCountry() {
      return this.countries && this.countries.length
        ? this.countries
        : this.values
            .map(item => item.country)
            .filter(removeDuplicate)
            .filter(item => item !== 'XX')
    },
    // [{id: 147209, country: 'PL', name: '', logo: 'mbank'}]
    listSelect() {
      return this.values
        .filter(this.listSelectFilter)
        .sort(sort('country_priority'))
        .sort(sort('user_priority', true))
    },
    list() {
      let search = this.search.toLowerCase()
      if (search) {
        return this.listSelect.filter(
          ({ name = '', iban = '' }) =>
            name.toLowerCase().includes(search) ||
            iban.toLowerCase().includes(search)
        )
      } else {
        return this.listSelect
      }
    },
    listMin() {
      return this.list.slice(0, this.counts)
    },
    showCountry() {
      return this.enableCountry && this.listCountry.length > 1
    },
    showSearch() {
      return !this.noSearch && this.listSelect.length > 10
    },
    showView() {
      return this.isGermany
    },
    showMore() {
      return !this.noMore && this.list.length > this.counts
    },
    isBar() {
      return this.view_ === 'bar'
    },
    isList() {
      return this.view_ === 'list'
    },
    isMin() {
      return this.values.length < 4 && this.isBreakpoint && this.ready
    },
    view() {
      return this.isMin ? 'min' : this.view_
    },
    classItemWrapper() {
      let className
      if (this.isMin || this.isList) {
        className = 'f-col-12'
      } else if (this.isBar) {
        className = `f-col-6 f-col-${this.breakpoint}-4`
      }
      return [className, 'f-mb-12', `f-mb-${this.breakpoint}-16`]
    },
    classItem() {
      return [this.$style.item, this.$style[`item_${this.view}`]]
    },
    classBankViewBar() {
      return this.$uiClass('view_icon', {
        active: this.isBar,
      })
    },
    classBankViewList() {
      return this.$uiClass('view_icon', {
        active: this.isList,
      })
    },
    classIcon() {
      return [this.$style.icon, this.$style[`icon_${this.view}`]]
    },
    classItemBody() {
      return [this.$style.item_body, this.$style[`item_body_${this.view}`]]
    },
    isGermany() {
      return this.default_country === 'DE'
    },
    sizeIcon() {
      return this.isList ? '24' : '48'
    },
    preloader() {
      return this.isBreakpoint ? Array(10) : Array(15)
    },
    count() {
      return this.isBreakpoint ? 10 : 15
    },
    isBreakpoint() {
      return this[`isBreakpointDown${upperFirst(this.breakpoint)}`]
    },
  },
  watch: {
    ready: 'watchReady',
  },
  created() {
    this.counts = this.count
    this.autoClick()
  },
  methods: {
    clickItem(item) {
      if (SUPPORTED_SYSTEM_ROUTE.includes(item.tab)) {
        this.goSystem(item)
      } else {
        this.$emit('select', item)
      }
    },
    clear() {
      this.search = ''
      this.setView('bar')
    },
    loadMore() {
      this.spin = true
      this.timeout(() => {
        this.counts += this.count
        this.spin = false
      }, 300)
    },
    setView(view) {
      this.view_ = view
    },
    listSelectFilter({ country, method }) {
      return this.showCountry && method === 'banks'
        ? [this.default_country, 'XX'].includes(country)
        : true
    },
    watchReady() {
      this.autoClick()
    },
    goSystem({ tab, id }) {
      this.$router
        .push({ name: 'system', params: { method: tab, system: id } })
        .catch(() => {})
    },
    autoClick() {
      if (!this.ready) return
      if (this.values.length !== 1) return

      this.goSystem(this.values[0])
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-size: px-to-rem(18px);
  line-height: px-to-rem(26px);
  font-weight: 500;
  margin-bottom: px-to-rem(24px);
}

.title_light {
  color: #3d3d3d;
}

.title_dark {
  color: #fff;
}

.item {
  display: flex;
  align-items: center;
  width: 100%;
  color: $bank_item_color;
  cursor: pointer;
  border-radius: $border-radius;
  transition:
    background-color ease-in-out 0.15s,
    color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &:hover {
    color: $bank_item_hover_color;
  }
}

.item_min {
  flex-direction: row-reverse;
  padding: px-to-rem(12px);
  border: px-to-rem(1px) solid $menu_item_border;
  transition: box-shadow ease-in-out 0.15s;

  &:hover {
    padding: px-to-rem(13px);
    background: $menu_item_hover_bg;
    border: none;
  }

  &:focus-visible {
    outline: 0;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(4px) $outline_border;
  }
}

.item_body {
  flex-grow: 1;
}

.item_body_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  min-width: px-to-rem(48px);
  margin-right: px-to-rem(12px);
  border-radius: $border-radius;
  box-shadow: 0 px-to-rem(1px) px-to-rem(4px) $bank_icon_shadow;
}

.icon_list {
  min-width: px-to-rem(24px);
  border-radius: $border-radius-sm;
  box-shadow: none;
}

.icon_min {
  margin: 0;
}

.name {
  font-size: px-to-rem(14px);
  word-wrap: break-word;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col_12 {
  flex: 0 0 100%;
  max-width: 100%;

  @include media-breakpoint-up(sm) {
    &:not(:last-child) {
      margin-right: px-to-rem(16px);
    }
  }
}

.country {
  @include media-breakpoint-up(sm) {
    flex: 0 0 px-to-rem(220px);
    max-width: px-to-rem(220px);
  }
}

.search {
  @include media-breakpoint-up(sm) {
    flex: 1;
  }
}

.view {
  display: flex;
  height: px-to-rem(44px);
  border: 1px solid $input_border;
  border-radius: $border-radius;
  margin-bottom: px-to-rem(16px);

  @include media-breakpoint-up(sm) {
    flex: 0 0 px-to-rem(100px);
    max-width: px-to-rem(100px);
  }
}

.view_icon {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-right: 1px solid $input_border;

  &:hover {
    color: $bank_view_icon_active_color;
    background-color: $bank_view_icon_active_bg;
    transition: all ease-in-out 0.15s;
  }

  &:first-child {
    border-radius: $border-radius 0 0 $border-radius;
  }

  &:last-child {
    border: none;
    border-radius: 0 $border-radius $border-radius 0;
  }
}

.view_icon_active {
  color: $bank_view_icon_active_color;
  background-color: $bank_view_icon_active_bg;
  transition: all ease-in-out 0.15s;
}

.text_center {
  text-align: center;
}
</style>
