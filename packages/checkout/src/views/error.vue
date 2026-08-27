<template>
  <ul>
    <li>{{ release }} commithash {{ commithash }}</li>
    <li v-for="error in $route.query.errors" :key="error">
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      commithash: COMMITHASH,
      release: RELEASE,
    }
  },
}
</script>
