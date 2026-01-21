<template>
  <div>
    <div :class="$uiClass('style')">
      <f-icon :name="info.logo" :type="method" :class="$style.icon" size="48" />
      <div :class="$style.mr_12">{{ info.name }}</div>

      <div>{{ info.iban }}</div>
      <f-button-close
        v-if="showClose"
        :class="$uiClass('close')"
        @click="goMethod"
      />
    </div>
    <router-view v-slot="{ Component }">
      <transition name="f-fade-enter">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import FButtonClose from '@/components/button/button-close'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { isNotButtonOnly } from '@/utils/method'

export default {
  components: {
    FIcon,
    FButtonClose,
  },
  inheritAttrs: false,
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    ...mapState(['tabs']),
    info() {
      return this.tabs[this.method][this.system]
    },
    showClose() {
      return (
        isNotButtonOnly(this.info) &&
        Object.values(this.tabs[this.method]).filter(isNotButtonOnly).length > 1
      )
    },
  },
  methods: {
    goMethod() {
      this.$router.push({ name: this.method })
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: relative;
  display: flex;
  align-items: center;
  padding: px-to-rem(12px);
  margin-bottom: px-to-rem(12px);
  background: var(--bg);
  border-radius: $border-radius;
}

.style_light {
  --bg: #{$ash_300};
}

.style_dark {
  --bg: #414549;
}

.icon {
  margin-right: px-to-rem(12px);
  border-radius: $border-radius;
}

.mr_12 {
  margin-right: px-to-rem(12px);
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: px-to-rem(20px);
  font-size: px-to-rem(28px);
  font-weight: 300;
  color: var(--color);

  &:hover {
    color: var(--hover-color);
  }
}

.close_light {
  --color: #{$grey};
  --hover-color: #{$grey};
}

.close_dark {
  --color: #8d8f92;
  --hover-color: #{$white};
}
</style>
