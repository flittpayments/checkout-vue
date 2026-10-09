export const idProps = {
  id: {
    type: String,
    default: null,
  },
}

export const idMixin = {
  props: idProps,
  data() {
    return {
      localId_: `${SAAS_TEMPLATE_NAME}-${this._.uid}`,
    }
  },
  computed: {
    safeId() {
      const id = this.id || this.localId_

      return (suffix = '') => {
        if (!id) return null
        suffix = String(suffix).replace(/\s+/g, '_')
        return suffix ? `${id}_${suffix}` : id
      }
    },
  },
}
