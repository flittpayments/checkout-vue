<template>
  <div>
    <div class="f-system">
      <f-icon
        :name="info.logo"
        :type="method"
        class="f-system-icon"
        size="48"
      />
      <div class="f-system-name">{{ info.name }}</div>

      <div>{{ info.iban }}</div>
      <f-button-close class="f-system-close" @click="goMethod" />
    </div>
    <transition name="f-fade-enter">
      <router-view />
    </transition>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import { FButtonClose } from '@/components/button/button-close'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

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
  },
  methods: {
    goMethod() {
      this.$router.push({ name: this.method }).catch(() => {})
    },
  },
}
</script>
