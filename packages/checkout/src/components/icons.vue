<template>
  <div v-if="show" :class="$style.wrapper">
    <span v-if="showTitle" :class="$style.title" v-text="title" />
    <f-icon
      v-for="({ logo, method }, index) in listFirst"
      :key="index"
      :class="classItem"
      size="24"
      :name="logo"
      :type="method"
    />
    <f-button-unstyled v-if="showCount" ref="last" :class="classCount">
      +{{ countLast }}
    </f-button-unstyled>
    <f-tooltip-icons :target="() => $refs.last?.$el">
      <f-icon
        v-for="({ logo, method }, index) in listLast"
        :key="index"
        :class="$uiClass('item_tooltip')"
        size="24"
        :name="logo"
        :type="method"
      />
    </f-tooltip-icons>
  </div>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FIcon from '@/components/icon'
import FTooltipIcons from '@/components/tooltip/tooltip-icons'
import { mapState } from '@/utils/store'
import configMethods from '@/config/methods.json'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_NUMBER,
  PROP_TYPE_BOOLEAN,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'
import { isString } from '@/utils/inspect'

export default {
  components: {
    FButtonUnstyled,
    FIcon,
    FTooltipIcons,
  },
  props: {
    title: makeProp(PROP_TYPE_STRING),
    type: makeProp(PROP_TYPE_STRING, 'card', value =>
      arrayIncludes(configMethods, value)
    ),
    count: makeProp(PROP_TYPE_NUMBER, 3),
    isActive: makeProp(PROP_TYPE_BOOLEAN),
  },
  computed: {
    ...mapState(['options']),
    classItem() {
      return this.$uiClass('item', {
        active: this.isActive,
      })
    },
    classCount() {
      return this.$uiClass('count', {
        active: this.isActive,
      })
    },
    showTitle() {
      return this.title
    },
    list() {
      return (this.options[this.type + '_icons'] || []).map(item =>
        isString(item) ? { logo: item, method: this.type } : item
      )
    },
    listFirst() {
      if (this.list.length <= this.count + 1) return this.list
      return this.list.slice(0, this.count)
    },
    listLast() {
      return this.list.slice(this.count)
    },
    show() {
      return this.list.length
    },
    showCount() {
      return this.list.length > this.count + 1
    },
    countLast() {
      return this.list.length - this.count
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  padding: px-to-rem(4px) 0;
}

.title {
  margin-right: px-to-rem(16px);
  font-weight: 300;
  letter-spacing: px-to-rem(-0.3px);
}

.item {
  margin-right: px-to-rem(8px);
  border-radius: $border-radius-sm;
  box-shadow: 0 px-to-rem(1px) px-to-rem(4px) var(--shadow-color);

  &:last-child {
    margin-right: 0;
  }
}

.item_light {
  --shadow-color: #cacfd6;
}

.item_dark {
  --shadow-color: #{$white_01};
}

.item_adaptive {
  @include media-breakpoint-up(lg) {
    opacity: 0.3;
    transition: all ease-in-out 0.15s;
  }
}

.item_active {
  opacity: 1;
}

.item_tooltip {
  margin-right: px-to-rem(8px);
  border-radius: $border-radius-sm;
  margin: 0 px-to-rem(8px) px-to-rem(8px) 0;
  box-shadow: 0 px-to-rem(1px) px-to-rem(4px) var(--shadow-color);
}

.item_tooltip_light {
  --shadow-color: #{$grey_9};
}

.item_tooltip_dark {
  --shadow-color: #cacfd6;
}

.count {
  display: block;
  width: px-to-rem(24px);
  height: px-to-rem(24px);
  font-size: px-to-rem(10px);
  line-height: px-to-rem(24px);
  color: var(--color);
  text-align: center;
  background: var(--bg);
  border-radius: $border-radius-sm;
  transition: all ease-in-out 0.15s;

  &:hover {
    color: var(--hover-color);
    text-decoration: none;
  }
}

.count_light {
  --color: #{$grey_2};
  --hover-color: #{$grey_3};
  --active-color: #{$grey_4};
  --bg: #{$ash_200};
  --active-bg: #{$white};
}

.count_dark {
  --color: #cecfd0;
  --hover-color: #b4b6b7;
  --active-color: #d8d8d9;
  --bg: #{$white_02};
  --active-bg: #626468;
}

.count_active {
  color: var(--active-color);
  background: var(--active-bg);
}
</style>
