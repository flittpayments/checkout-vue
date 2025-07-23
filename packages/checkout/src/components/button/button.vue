<template>
  <component :is="tag" v-bind="attrs" v-on="$listeners">
    <slot>
      <span v-text="text" />
    </slot>
    <f-svg v-if="loading" :class="$style.spin" name="redo" size="20" spin />
  </component>
</template>

<script>
import FSvg from '@/components/svg'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FSvg,
  },
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    loading: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(
        ['success', 'default', 'secondary', 'outline', 'light', 'dark'],
        value
      )
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['lg', 'icon'], value)
    ),
    text: makeProp(PROP_TYPE_STRING),
    type: makeProp(PROP_TYPE_STRING, 'button'),
  },
  computed: {
    tag() {
      return this.$attrs.href ? 'a' : 'button'
    },
    attrs() {
      return {
        ...this.$attrs,
        disabled: this.disabled,
        class: this.className,
        type: this.tag === 'button' ? this.type : undefined,
      }
    },
    className() {
      return [
        this.$style.style,
        this.$uiClass(this.variant),
        {
          [this.$style.block]: this.block,
          [this.$style[this.size]]: this.size,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: relative;
  display: inline-block;
  min-height: px-to-rem(44px);
  padding: px-to-rem(10px) px-to-rem(32px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(24px);
  text-align: center;
  background: none;
  border: none;
  border-radius: $border-radius;
  transition: all ease-in-out 0.15s;

  span {
    position: relative;
    z-index: 1;
  }

  &::before {
    position: absolute;
    bottom: px-to-rem(2px);
    left: 5%;
    z-index: 0;
    width: 90%;
    height: px-to-rem(32px);
    content: '';
    border-radius: $border-radius-lg;
    transition: all ease-in-out 0.15s;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    content: '';
    border-radius: $border-radius;
    transition: all ease-in-out 0.15s;
  }

  &:hover,
  &:focus {
    text-decoration: none;
    transform: translateY(px-to-rem(-2px));
  }

  &:focus-visible {
    outline: 0;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(4px) $outline_border;
  }

  &:active {
    transform: translateY(0);
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}

.success {
  @include button-variant(
    $btn_success_bg,
    null,
    $btn_success_color,
    $btn_success_shadow,
    darken($btn_success_bg, 20%),
    null,
    $btn_success_color,
    $btn_success_shadow,
    darken($btn_success_bg, 40%),
    null,
    $btn_success_color,
    $btn_success_shadow
  );

  #{$prefix}outline_border: $btn_success_bg;
}

.success_dark {
  &::before,
  &:hover::before,
  &:focus::before,
  &:active::before {
    box-shadow: 0 px-to-rem(10px) px-to-rem(25px) rgb(0 0 0 / 60%);
  }
}

.default {
  font-size: px-to-rem(16px);
  font-weight: 500;

  @include button-variant(
    $btn_default_bg,
    null,
    $btn_default_color,
    null,
    $btn_default_hover_bg,
    null,
    $btn_default_hover_color,
    $btn_default_hover_shadow,
    $btn_default_active_bg,
    null,
    $btn_default_active_color,
    $btn_default_active_shadow
  );
}

.secondary {
  font-size: px-to-rem(16px);
  font-weight: 500;

  @include button-variant(
    $btn_secondary_bg,
    null,
    $btn_secondary_color,
    null,
    $btn_secondary_hover_bg,
    null,
    $btn_secondary_hover_color,
    $btn_secondary_hover_shadow,
    $btn_secondary_active_bg,
    null,
    $btn_secondary_active_color,
    $btn_secondary_active_shadow
  );
}

.light {
  @include button-variant(
    $btn_light_bg,
    null,
    $btn_light_color,
    null,
    darken($btn_light_bg, 20%),
    null,
    null,
    null,
    darken($btn_light_bg, 40%),
    null,
    null,
    null
  );
}

.dark {
  @include button-variant(
    $btn_dark_bg,
    null,
    $btn_dark_color,
    null,
    lighten($btn_dark_bg, 20%),
    null,
    null,
    null,
    lighten($btn_dark_bg, 40%),
    null,
    null,
    null
  );
}

.outline {
  font-size: px-to-rem(14px);
  font-weight: 500;

  @include button-variant(
    $btn_outline_bg,
    $btn_outline_border,
    $btn_outline_color,
    null,
    $btn_outline_hover_bg,
    $btn_outline_hover_border,
    $btn_outline_hover_color,
    null,
    $btn_outline_active_bg,
    $btn_outline_active_border,
    $btn_outline_active_color,
    null
  );
}

.block {
  display: block;
  width: 100%;
}

.lg {
  min-height: px-to-rem(56px);
  padding: px-to-rem(16px) px-to-rem(32px);
  font-size: px-to-rem(18px);
}

.icon {
  width: px-to-rem(48px);
  height: px-to-rem(48px);
  padding-right: 0;
  padding-left: 0;
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
