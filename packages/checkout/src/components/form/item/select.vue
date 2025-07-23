<template>
  <ValidationProvider
    ref="validation"
    :class="$style.wrapper"
    v-bind="attrsValidation"
  >
    <f-form-select
      ref="input"
      v-model="innerValue"
      :class="[$uiClass('style'), classInput]"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { FFormSelect } from '@/components/form/item/helpers/form-select'
import { itemMixin } from '@/mixins/item'

export default {
  components: {
    ValidationProvider,
    FFormSelect,
  },
  mixins: [itemMixin],
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
}

:global(#f) .style {
  padding-right: px-to-rem(24px);
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: right px-to-rem(8px) center;
  appearance: none;

  // Hides the default caret in IE11
  &::-ms-expand {
    display: none;
  }

  // Remove outline from select box in FF
  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 $input_color;
  }

  &:hover {
    background-color: inherit;
  }

  &[disabled] {
    opacity: 1;
  }

  > option {
    color: initial;
  }
}

:global(#f) .style_light {
  background-image: escape-svg($input-select-arrow-light);
}

:global(#f) .style_dark {
  background-image: escape-svg($input-select-arrow-dark);
}
</style>
