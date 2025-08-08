<template>
  <div>
    <f-button-default
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
    </f-button-default>
  </div>
</template>

<script>
import FButtonDefault from '@/components/button/button-default'
import SvgPayme from '@/svg/payme.svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButtonDefault,
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

.paybypayme.paybypayme {
  --bg: #33cbcb;
  --hover-bg: #33cbcb;
  --active-bg: #33cbcb;
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
