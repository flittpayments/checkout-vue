<template>
  <div>
    <f-mode-wrapper />
    <router-view />
  </div>
</template>

<script>
import FModeWrapper from '@/components/mode-wrapper'

export default {
  components: {
    FModeWrapper,
  },
}
</script>
