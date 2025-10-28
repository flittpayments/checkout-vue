<template>
  <div :class="$uiClass('wrapper')">
    <transition name="f-fade">
      <div v-if="model">
        <div
          v-if="model.send_data.mfo"
          :class="$uiClass('title')"
          v-text="$t('mfo_title', [model.send_data.receipt_orig])"
        />
        <template v-if="isIbox">
          <div
            :class="[$uiClass('title'), $style.text_left]"
            v-text="$t('ibox_title')"
          />

          <div v-text="$t('full_requesites')" />
          <div v-text="$t('full_requesites_explain')" />
        </template>

        <div :class="$uiClass('props')">
          <div v-if="model.send_data.amount" :class="$style.row">
            <div :class="$style.key" v-text="$t('amount')" />
            <div :class="$uiClass('value')">
              {{ model.send_data.amount }} <span v-text="$t('UAH')" />
            </div>
          </div>
          <div :class="$style.row">
            <div :class="$style.key" v-text="$t('receiver')" />
            <div :class="$uiClass('value')">{{ model.send_data.receiver }}</div>
          </div>
          <div v-if="model.send_data.current_bill" :class="$style.row">
            <div :class="$style.key" v-text="$t('current_bill')" />
            <div :class="$uiClass('value')">
              {{ model.send_data.current_bill }}
            </div>
          </div>
          <div v-if="model.send_data.usreou" :class="$style.row">
            <div :class="$style.key" v-text="$t('usreou')" />
            <div :class="$uiClass('value')">{{ model.send_data.usreou }}</div>
          </div>
          <div v-if="model.send_data.bank" :class="$style.row">
            <div :class="$style.key" v-text="$t('bank')" />
            <div :class="$uiClass('value')">{{ model.send_data.bank }}</div>
          </div>
          <div v-if="model.send_data.mfo" :class="$style.row">
            <div :class="$style.key" v-text="$t('mfo')" />
            <div :class="$uiClass('value')">{{ model.send_data.mfo }}</div>
          </div>
          <template v-if="model.send_data.mfo">
            <div v-if="model.send_data.receipt_id" :class="$style.row">
              <div :class="$style.key" v-text="$t('purpose')" />
              <div :class="$uiClass('value')">
                {{ model.send_data.receipt_id }}
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="model.send_data.receipt_orig" :class="$style.row">
              <div :class="$style.key" v-text="$t('receipt_id')" />
              <div :class="$uiClass('value')">
                № {{ model.send_data.receipt_orig }}
              </div>
            </div>
          </template>
          <div v-if="model.send_data.end_date" :class="$style.row">
            <div :class="$style.key" v-text="$t('end_date')" />
            <div :class="$uiClass('value')">{{ model.send_data.end_date }}</div>
          </div>
        </div>

        <div v-if="isIbox" v-html="$t('ibox_desc')" />

        <div :class="['f-row', $style.buttons]">
          <div class="f-col">
            <f-button-success
              :href="model.url"
              target="_blank"
              :text="$t('save_receipt')"
            />
          </div>
          <template v-if="isDesktop">
            <div class="f-col">
              <f-button-default
                size="lg"
                block
                :text="$t('save_qr_code')"
                @click="click"
              />
              <f-modal-wrapper ref="modal" size="sm">
                <f-loading v-if="loadingQrCode" />
                <div :class="$style.img">
                  <img :src="qrCode" @load="loadQrCode" />
                </div>
                <div
                  v-if="!loadingQrCode"
                  :class="$style.text"
                  v-text="$t('qr_code_text')"
                />
              </f-modal-wrapper>
            </div>
          </template>
        </div>

        <div v-if="isIbox" :class="$style.info">
          <f-svg :class="$style.svg" name="warning" />
          <div v-html="$t('ibox_info')" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FButtonSuccess from '@/components/button/button-success'
import FButtonDefault from '@/components/button/button-default'
import FModalWrapper from '@/components/modal/modal-wrapper'
import { FLoading } from '@/import'
import FSvg from '@/components/svg'
import { isDesktop } from '@/utils/mobile'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButtonSuccess,
    FButtonDefault,
    FModalWrapper,
    FLoading,
    FSvg,
  },
  inject: ['submit'],
  data() {
    return {
      model: null,
      loadingQrCode: false,
    }
  },
  computed: {
    qrCode() {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.model.url}`
    },
    isIbox() {
      return !this.model.send_data.mfo
    },
    isDesktop() {
      return isDesktop
    },
  },
  mounted() {
    this.submit()
      .then(model => {
        this.model = model.data
      })
      .catch(errorHandler)
  },
  methods: {
    click() {
      this.$refs.modal.show()
      this.loadingQrCode = true
    },
    loadQrCode() {
      this.loadingQrCode = false
    },
  },
}
</script>

<style lang="scss" module>
.wrapper_adaptive {
  @include breakpoints.up(xl) {
    max-width: 600px;
    margin: 0 auto;
  }
}

.title {
  color: var(--color);
  font-size: px-to-rem(24px);
  font-weight: 600;
  text-align: center;
  margin: 0 0 px-to-rem(20px);
}

.title_light {
  --color: #{$grey};
}

.title_dark {
  --color: #{$white};
}

.text_left {
  text-align: left;
}

.props {
  background: var(--bg);
  padding: px-to-rem(16px) px-to-rem(20px);
  margin: 0 px-to-rem(-20px) px-to-rem(12px);
}

.props_light {
  --bg: #f7f8f9;
}

.props_dark {
  --bg: #3b3f43;
}

.props_adaptive {
  @include breakpoints.up(md) {
    padding-right: px-to-rem(40px);
    padding-left: px-to-rem(40px);
    margin-right: px-to-rem(-40px);
    margin-left: px-to-rem(-40px);
  }

  @include breakpoints.up(lg) {
    padding: px-to-rem(20px);
    margin-right: 0;
    margin-left: 0;
    border-radius: $border-radius;
  }
}

.row {
  margin-bottom: px-to-rem(18px);

  &:last-child {
    margin-bottom: 0;
  }

  @include breakpoints.up(sm) {
    display: flex;
  }
}

.key {
  font-size: px-to-rem(14px);

  @include breakpoints.up(sm) {
    flex: 0 0 160px;
  }
}

.value {
  color: var(--color);
}

.value_light {
  --color: #3d3d3d;
  font-weight: 600;
}

.value_dark {
  --color: #fff;
}

.buttons {
  margin-top: px-to-rem(24px);
  margin-bottom: px-to-rem(34px);
}

.img {
  margin-bottom: px-to-rem(24px);
  text-align: center;
}

.text {
  margin: 0 px-to-rem(-32px);
  font-size: px-to-rem(14px);
  text-align: center;
}

.info {
  display: flex;
}

.svg {
  margin: px-to-rem(10px) px-to-rem(12px) 0 0;
}
</style>
