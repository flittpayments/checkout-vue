<template>
  <div :class="$style.style">
    <f-progress class="f-mr-12" size="48x48" />
    <div :class="$style.flex_grow_1">
      <f-progress size="20" />
    </div>
  </div>
</template>

<script>
import FProgress from '@/components/base/progress'

export default {
  components: { FProgress },
}
</script>

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
}

.flex_grow_1 {
  flex-grow: 1;
}
</style>
