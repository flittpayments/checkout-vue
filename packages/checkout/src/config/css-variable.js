import presets from '@/config/presets'
import cssVariableDefault from '@/config/css-variable-default'
import cssVariableLight from '@/config/css-variable-light'
import cssVariableDark from '@/config/css-variable-dark'
import { isString, isPlainObject } from '@/utils/inspect'
import { regexpColor } from '@/config/regexp'
import configPreset from '@/config/preset.json'

export default function ({ type, preset }) {
  const presetDefault = configPreset[type]
  return Object.assign(
    {
      card_img: '',
      border_radius: 8,
    },
    cssVariableDefault,
    {
      light: cssVariableLight,
      dark: cssVariableDark,
    }[type],
    presets[preset] ||
      (regexpColor.test(preset) && { main: preset }) ||
      presets[isString(presetDefault) ? presetDefault : ''] ||
      (isPlainObject(presetDefault) ? presetDefault : {})
  )
}
