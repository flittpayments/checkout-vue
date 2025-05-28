<template>
  <ul>
    <li>{{ commithash }} {{ version }}</li>
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
      version: VERSION,
    }
  },
}
</script>
