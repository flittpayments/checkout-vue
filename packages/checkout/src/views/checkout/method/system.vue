<template>
  <div>
    <div :class="$style.style">
      <f-icon :name="info.logo" :type="method" :class="$style.icon" size="48" />
      <div :class="$style.mr_12">{{ info.name }}</div>

      <div>{{ info.iban }}</div>
      <f-button-close
        v-if="showClose"
        :class="$style.close"
        @click="goMethod"
      />
    </div>
    <transition name="f-fade-enter">
      <router-view />
    </transition>
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
      this.$router.push({ name: this.method }).catch(() => {})
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
  background-color: $bank_select_bg;
  border-radius: $border-radius;
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
  color: $bank_select_close_color;

  &:hover {
    color: $bank_select_close_hover_color;
  }
}
</style>
