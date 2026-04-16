<template>
  <div>
    <f-button
      v-for="method in methods"
      :key="method.id"
      :class="[$style.btn, $uiClass(method.alias)]"
      block
      :text="method.name"
      @click="click(method)"
    >
      <span v-if="method.alias === 'paybypayme'" :class="$style.span">
        <svg-payme />
      </span>
    </f-button>
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import SvgPayme from '@/svg/payme.svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButton,
    SvgPayme,
  },
  computed: {
    ...mapState('tabs', ['quick_access']),
    methods() {
      return Object.values(this.quick_access)
    },
  },
  methods: {
    click({ tab, id }) {
      this.$router
        .push({ name: 'system', params: { method: tab, system: id } })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.btn {
  margin-bottom: px-to-rem(24px);

  &:last-child {
    margin: 0;
  }
}

.paybypayme {
  #{$prefix}btn_default_bg: #33cbcb;
  #{$prefix}btn_default_hover_bg: #33cbcb;
  #{$prefix}btn_default_active_bg: #33cbcb;
}

.span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: px-to-rem(24px);
}
.span svg {
  height: 100%;
}
</style>
