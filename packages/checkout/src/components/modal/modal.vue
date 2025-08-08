<template>
  <f-modal-base v-bind="attrs" v-on="$listeners">
    <template #header>
      <f-button-close v-if="!$attrs.noHeaderClose" @click="hide" />
      <slot name="image" />
      <h5 v-if="title" :class="$style.title">{{ title }}</h5>
    </template>
    <template #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
    <template #footer="scope">
      <slot name="footer" v-bind="scope" />
    </template>
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import FButtonClose from '@/components/button/button-close'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FModalBase,
    FButtonClose,
  },
  inheritAttrs: false,
  props: {
    title: makeProp(PROP_TYPE_STRING),
    size: makeProp(PROP_TYPE_STRING, 'md'),
    scrollable: makeProp(PROP_TYPE_BOOLEAN, false),
    noBodyPadding: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'modal',
        visible: true,
        footer: !!this.$scopedSlots.footer,
        modalClass: this.$style.modal, //.f-modal
        dialogClass: this.dialogClass,
        contentClass: this.$style.content,
        headerClass: this.headerClass,
        bodyClass: this.bodyClass,
        footerClass: this.$style.footer,
      }
    },
    dialogClass() {
      return [
        this.$style.dialog,
        this.$style[this.size],
        {
          [this.$style.scrollable]: this.scrollable,
        },
      ]
    },
    headerClass() {
      return [
        this.$style.header,
        {
          [this.$style.p_0]: !this.title && !this.$scopedSlots.image,
        },
      ]
    },
    bodyClass() {
      return [
        this.$style.body,
        {
          [this.$style.p_0]: this.noBodyPadding,
        },
      ]
    },
  },
  methods: {
    hide() {
      this.$refs.modal.hide()
    },
  },
}
</script>

<style lang="scss" module>
:global(.f-modal-open) {
  overflow: hidden;
}

:global(.f-modal-open) .modal {
  overflow: hidden auto;
}

.modal:global(.f-is-transitioning) {
  overflow: hidden;
}

:global(#f) .modal {
  transition-duration: 0.3s;
}

.modal {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zindex-modal;
  display: none;
  width: 100%;
  height: 100%;

  // Prevent Chrome on Windows from adding a focus outline. For details, see
  // https://github.com/twbs/bootstrap/pull/10951.
  outline: 0;

  // We deliberately don't use `-webkit-overflow-scrolling: touch;` due to a
  // gnarly iOS Safari bug: https://bugs.webkit.org/show_bug.cgi?id=158342
  // See also https://github.com/twbs/bootstrap/issues/17695

  &:global(.f-fade) .dialog {
    transition: transform 0.3s ease-out;
    transform: translate3d(0, 25%, 0);

    @include media-breakpoint-up(md) {
      transform: translate(0, -50px);
    }
  }

  &:global(.f-show) .dialog {
    transform: none;
  }

  // When trying to close, animate focus to scale
  //.modal.modal-static .dialog {
  //  transform: scale(1.02);
  //}
}

// Measure scrollbar width for padding body during modal show/hide
:global(.f-modal-scrollbar-measure) {
  position: absolute;
  top: -9999px;
  width: 50px;
  height: 50px;
  overflow: scroll;
}

.dialog {
  position: relative;
  display: flex;
  align-items: flex-end;
  width: auto;
  min-height: 100%;
  margin: 0;

  // allow clicks to pass through for custom click handling to close modal
  pointer-events: none;

  @include media-breakpoint-up(md) {
    align-items: center;
    max-width: $modal-md;
    min-height: 100%;
    margin: 0 auto;
  }
}

.sm {
  @include media-breakpoint-up(md) {
    max-width: $modal-sm;
  }
}

.lg,
.xl {
  @include media-breakpoint-up(lg) {
    max-width: $modal-lg;
  }
}

.xl {
  @include media-breakpoint-up(xl) {
    max-width: $modal-xl;
  }
}

.scrollable {
  align-items: normal;
  height: 100%;
}

.content {
  #{$prefix}container_bg: $white;
  #{$prefix}outline_border: #9ca7b3;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%; // Ensure `.content` extends the full width of the parent `.dialog`
  padding: px-to-rem(20px) 0 0;
  margin-top: px-to-rem(88px);
  font-size: px-to-rem(14px);
  color: $grey_3;

  // counteract the pointer-events: none; in the .dialog
  pointer-events: auto;
  background-color: $white;
  background-clip: padding-box;
  border-radius: $border-radius-lg $border-radius-lg 0 0;

  // Remove focus outline from opened modal
  outline: 0;
  box-shadow: 0 20px 30px rgb(57 64 75 / 30%);

  @include media-breakpoint-up(md) {
    padding: px-to-rem(40px) 0 0;
    margin-top: 0;
    font-size: px-to-rem(16px);
    border-radius: $border-radius-lg;
  }
}

:global(.f-modal-backdrop) {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zindex-modal-backdrop;
  width: 100vw;
  height: 100vh;
  background-color: #32353a;
  opacity: $modal-backdrop-opacity;

  &:global(.f-fade) {
    opacity: 0;
  }

  &:global(.f-show) {
    opacity: $modal-backdrop-opacity;
  }
}

.header {
  text-align: center;
  position: relative;
  padding: 0 px-to-rem(20px) px-to-rem(16px);

  :global(.f-close) {
    position: absolute;
    top: calc(-60px - 20px);
    right: px-to-rem(4px);
    padding: px-to-rem(16px);
    font-size: px-to-rem(32px);
  }

  @include media-breakpoint-up(md) {
    padding: 0 px-to-rem(50px) px-to-rem(16px);

    :global(.f-close) {
      top: px-to-rem(-60px);
      right: px-to-rem(-44px);
    }
  }
}

.title {
  @include title;

  margin-bottom: 0;
  color: $grey;
}

.body {
  position: relative;

  // Enable `flex-grow: 1` so that the body take up as much space as possible
  // when there should be a fixed height on `.dialog`.
  flex: 1 1 auto;
  height: 100%;
  padding: 0 px-to-rem(20px) px-to-rem(20px);
  line-height: 1.5;
  word-wrap: break-word;

  @include media-breakpoint-up(md) {
    padding: 0 px-to-rem(50px) px-to-rem(40px);
  }
}

.footer {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 px-to-rem(20px) px-to-rem(20px);

  @include media-breakpoint-up(md) {
    padding: 0 px-to-rem(50px) px-to-rem(40px);
  }
}

.p_0 {
  padding: 0;
}
</style>
