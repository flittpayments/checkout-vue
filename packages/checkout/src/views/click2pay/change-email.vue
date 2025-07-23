<template>
  <div :class="$style.wrapper">
    <template v-if="showCheck">
      <f-box :class="$style.box" @click.native="click">
        <div :class="$style.box_title">
          <svg-click2pay :class="$uiClass('svg')" />
          <span
            :class="$uiClass('title')"
            v-text="$t('c2p_pay_with_click_to_pay')"
          />
          <f-svg
            v-if="loading"
            :class="$style.spin"
            name="redo"
            size="20"
            spin
          />
        </div>
        <div :class="$uiClass('desc')" v-text="$t('c2p_registered_message')" />
      </f-box>
    </template>
    <transition name="f-fade-enter">
      <f-form-group
        v-if="showSave"
        v-model="save"
        name=""
        component="checkbox"
        @input="input"
      >
        <div ref="save" :class="$style.save" @click="open">
          <svg-click2pay :class="$uiClass('svg')" />
          <span v-html="$t('c2p_save_card_desc', { click2pay })" />
          <click2pay-modal-about ref="about" />
        </div>
      </f-form-group>
    </transition>
    <div v-if="error" :class="$style.error" v-text="$t(error)" />
  </div>
</template>

<script>
import SvgClick2pay from '@/svg/click2pay.svg'
import FBox from '@/components/box.vue'
import Click2payModalAbout from '@/views/click2pay/modal-about'
import { mapState, mapStateGetSet } from '@/utils/store'
import { switchUser } from '@/click2pay'
import FSvg from '@/components/svg.vue'

export default {
  components: {
    FSvg,
    SvgClick2pay,
    FBox,
    Click2payModalAbout,
  },
  data() {
    return {
      loading: false,
      save: false,
      error: '',
    }
  },
  computed: {
    ...mapState('click2pay', ['actionCode']),
    ...mapState('click2pay', {
      emailClick2pay: 'email',
    }),
    ...mapStateGetSet(['params']),
    ...mapState('params', ['email']),
    click2pay() {
      return `<a href="">${this.$t('click2pay')}</a>`
    },
    showCheck() {
      return this.actionCode !== 'SUCCESS' && this.emailClick2pay !== this.email
    },
    showSave() {
      return ['SUCCESS', 'ADD_CARD'].includes(this.actionCode)
    },
  },
  destroyed() {
    this.deleteParam()
  },
  methods: {
    click() {
      if (this.loading) return
      this.loading = true
      this.error = ''

      switchUser(this.email)
        .finally(() => {
          this.loading = false
        })
        .then(([actionCode, name]) => {
          this.store.setClick2payEmail(this.email)
          this.store.setClick2payActionCode(actionCode)

          this.$router.push({ name }).catch(() => {})
        })
        .catch(error => {
          this.store.setClick2payActionCode('')
          this.error = error
        })
    },
    open(ev) {
      if (ev.target !== this.$refs.save.querySelector('a')) return
      ev.preventDefault()

      this.$refs.about.show()
    },
    input(value) {
      if (value) {
        this.params.click2pay_save_card = true
      } else {
        this.deleteParam()
      }
    },
    deleteParam() {
      delete this.params.click2pay_save_card
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(32px);
}

.box {
  cursor: pointer;
  margin-bottom: px-to-rem(16px);
}

.box_title {
  display: flex;
  align-items: center;
  margin-bottom: px-to-rem(8px);
}

.desc {
  font-weight: 400;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
}

.desc_light {
  color: #5a6470;
}

.title {
  font-weight: 700;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
}

.title_light {
  color: #313539;
}

.title_dark {
  color: #fff;
}

.svg {
  margin-right: px-to-rem(8px);
  min-width: px-to-rem(36px);
}

.svg_light {
  color: #1434cb;
}

.svg_dark {
  color: #fff;
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}

.save {
  display: flex;
}

.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-top: px-to-rem(8px);
}
</style>
