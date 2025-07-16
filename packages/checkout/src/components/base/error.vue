<template>
  <transition
    :enter-class="$style.enter"
    :enter-active-class="$style.enter_active"
    :leave-active-class="$style.leave_active"
    :leave-to-class="$style.leave_to"
  >
    <div v-if="show" :class="$style.style" aria-live="polite">
      <slot />
    </div>
  </transition>
</template>

<script>
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  props: {
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
}
</script>

<style lang="scss" module>
.style {
  margin-top: px-to-rem(4px);
  font-weight: 500;
  color: $error;
}

.enter_active {
  transition: all 0.3s ease;
}

.leave_active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.enter,
.leave_to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
