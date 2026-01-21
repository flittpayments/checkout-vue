<template>
  <div>
    <f-title-system
      :logo="info.logo"
      :method="method"
      :name="info.name"
      @click="goMethod"
    >
      {{ info.iban }}
    </f-title-system>
    <router-view v-slot="{ Component }">
      <transition name="f-fade-enter">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import FTitleSystem from '@/components/base/title-system'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { isNotButtonOnly } from '@/utils/method'

export default {
  components: {
    FTitleSystem,
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
