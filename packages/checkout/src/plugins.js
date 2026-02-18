export const install = Vue => {
  Vue.prototype.$uiClass = function (name, options = {}, style = '$style') {
    const theme = this.store.state.options.theme.type

    if (Array.isArray(options)) {
      options = Object.fromEntries(options.map(key => [key, true]))
    }

    return Object.entries({
      ...options,
      '': true,
      light: theme === 'light',
      dark: theme === 'dark',
      adaptive: this.store.state.options.full_screen,
    })
      .map(([key, value]) => [
        this[style][name + (key ? '_' : '') + key],
        value,
      ])
      .filter(([key, value]) => value && key !== 'undefined')
      .map(([key]) => key)
      .join(' ')
  }
}
