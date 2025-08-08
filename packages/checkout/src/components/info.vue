<template>
  <div v-if="verification_type">
    <div
      :class="[$uiClass('title'), $style.mb_12]"
      v-text="$t('verification_t')"
    />
    <div
      :class="[$uiClass('desc'), $style.mb_12]"
      v-text="$t(`verification_${verification_type}_d`)"
    />
  </div>
  <div v-else>
    <div v-if="showTitle || showLink" :class="$style.mb_12">
      <div
        v-if="showTitle"
        :class="$uiClass('title')"
        data-e2e-merchant-name
        v-text="$t(title)"
      />
      <div v-if="showLink" data-e2e-merchant-url>
        <a :class="$uiClass('a')" :href="link" target="_blank">{{ link }}</a>
      </div>
    </div>
    <f-preloader
      v-if="show_order_desc"
      :condition="order_desc"
      size="20"
      :class="$style.mb_12"
    >
      <div
        ref="desc"
        :class="[$uiClass('desc'), $style.line_clamp_2]"
        data-e2e-order-desc
        v-text="$t(order_desc)"
      />
      <f-button-unstyled
        v-if="more"
        :class="$uiClass('more')"
        @click="$refs.modal.show()"
      >
        <span v-text="$t('see_more')" /> <f-svg name="angle-right" />
        <f-modal-wrapper ref="modal" :title="$t('order_details')" size="xl">
          <span v-text="$t(order_desc)" />
        </f-modal-wrapper>
      </f-button-unstyled>
    </f-preloader>
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FModalWrapper from '@/components/modal/modal-wrapper'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FPreloader,
    FButtonUnstyled,
    FSvg,
    FModalWrapper,
  },
  mixins: [resizeMixin],
  data() {
    return {
      more: false,
    }
  },
  computed: {
    ...mapState(['order']),
    ...mapState('options', [
      'title',
      'show_title',
      'link',
      'show_link',
      'show_order_desc',
    ]),
    ...mapState('params', ['order_desc', 'verification_type']),
    showTitle() {
      return this.show_title && this.title
    },
    showLink() {
      return this.show_link && this.link
    },
  },
  watch: {
    order_desc() {
      this.$nextTick().then(this.resize)
    },
  },
  mounted() {
    this.resize()
  },
  methods: {
    resize() {
      if (!this.$refs.desc) return

      this.more = false

      if (this.$refs.desc.offsetHeight >= this.$refs.desc.scrollHeight) return

      this.more = true
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-weight: 500;
  color: var(--color);
  word-wrap: break-word;
}

.title_light {
  --color: #{$ash_700};
}

.title_dark {
  --color: #{$white_04};
}

.mb_12 {
  margin-bottom: px-to-rem(12px);
}

:global(#f) .a {
  font-weight: 500;
  color: var(--color);

  &:hover {
    color: var(--hover-color);
  }
}

.a_light {
  --color: #{$ash_700};
  --hover-color: #{$grey_1};
}

.a_dark {
  --color: #{$white_04};
  --hover-color: #{$white_03};
}

.desc {
  color: var(--color);
}

.desc_light {
  --color: #{$grey_2};
}

.desc_dark {
  --color: #{$white};
}

.line_clamp_2 {
  overflow: hidden;
  display: block;
  max-height: $line-height-base * $font-size-base * 2;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
}

.more {
  font-weight: 600;
  color: var(--color);

  &:hover {
    color: var(--hover-color);
  }
}

.more_light {
  --color: #{$grey_3};
  --hover-color: #{$grey_4};
}

.more_dark {
  --color: #cbcccd;
  --hover-color: #b1b3b4;
}
</style>
