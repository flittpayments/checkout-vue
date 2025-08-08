<template>
  <f-row-error v-slot="scope" v-bind="$attrs" v-on="$listeners">
    <label
      v-if="label"
      :class="[$style.label, labelClass]"
      :for="id"
      @click="emitFocus"
    >
      {{ $t(label) }}
    </label>
    <div :class="$style.inner">
      <slot v-bind="scope" />
      <label
        v-if="prepend"
        :for="id"
        :class="$uiClass('prepend')"
        @click="emitFocus"
      >
        <f-svg :name="prepend" fw />
      </label>
      <label
        v-if="prependText"
        :for="id"
        :class="$uiClass('prepend_text')"
        @click="emitFocus"
      >
        {{ prependText }}
      </label>
    </div>
  </f-row-error>
</template>

<script>
import FRowError from '@/components/input/helpers/row-error'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRowError,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    prepend: makeProp(PROP_TYPE_STRING),
    prependText: makeProp(PROP_TYPE_STRING),
    labelClass: makeProp(PROP_TYPE_STRING),
  },
  methods: {
    emitFocus() {
      this.$emit('focus')
    },
  },
}
</script>

<style lang="scss" module>
.inner {
  position: relative;
}

.prepend,
.prepend_text {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  color: var(--color);
}

.prepend {
  left: 0;
}

.prepend_light {
  --color: #{$grey};
}

.prepend_dark {
  --color: #{$white_04};
}

.prepend_text {
  left: px-to-rem(12px);
}

.prepend_text_light {
  --color: #{$grey};
}

.prepend_text_dark {
  --color: #{$white_04};
}

.label {
  display: block;
  margin-bottom: px-to-rem(8px);
  font-size: px-to-rem(14px);
  word-wrap: break-word;
}
</style>
