<template>
  <f-box :class="$style.style">
    <div :class="$uiClass('head')">
      <slot />
      <f-button-unstyled @click="click">
        <f-svg :class="classArrow" name="angle-down" size="20" />
      </f-button-unstyled>
    </div>
    <transition name="f-collapse">
      <div v-if="open" :class="$uiClass('more')">
        <slot name="more" />
      </div>
    </transition>
  </f-box>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FBox from '@/components/box'
import FSvg from '@/components/svg'

export default {
  components: {
    FBox,
    FButtonUnstyled,
    FSvg,
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    classArrow() {
      return this.$uiClass('arrow', {
        open: this.open,
      })
    },
  },
  methods: {
    click() {
      this.open = !this.open
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: relative;
}

.head {
  display: flex;
  justify-content: space-between;
}

.head div {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  margin: 0;
}

.head_light div {
  color: #000;
}

.arrow {
  display: block;
  transition: transform 0.225s cubic-bezier(0.4, 0, 0.6, 1);
  transform: rotate(0deg);
}

.arrow_light {
  color: #000;
}

.arrow_open {
  transform: rotate(-180deg);
}

.more {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(20px);
  margin-top: px-to-rem(10px);
}

.more_light {
  color: #000;
}
</style>
