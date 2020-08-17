export default {
  data() {
    return {
      id: null,
    }
  },
  mounted() {
    this.id = `${SAAS_TEMPLATE_NAME}-${this._uid}`
  },
}
