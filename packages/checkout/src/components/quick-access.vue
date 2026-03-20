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
import { mapState, mapStateGetSet } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButton,
    SvgPayme,
  },
  inject: ['formRequest'],
  computed: {
    ...mapState(['has_fields']),
    ...mapState('tabs', ['quick_access']),
    ...mapStateGetSet('params', ['payment_system']),
    methods() {
      return Object.values(this.quick_access)
    },
  },
  methods: {
    click({ id, form, method }) {
      if (form?.fields || this.has_fields) {
        this.$router
          .push({ name: 'system', params: { method, system: id } })
          .catch(() => {})
      } else {
        this.payment_system = id
        this.formRequest(this.store.formParams()).catch(errorHandler)
      }
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
