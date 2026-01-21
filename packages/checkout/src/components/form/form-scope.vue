<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { provide } from 'vue'

export default {
  setup() {
    provide('form', {
      submit: () => {},
    })
  },
}
</script>
