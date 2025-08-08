import presets from '@/config/presets'
const ash_300 = '#EEF0F2' // 212 13 94
const ash_500 = '#D5DAE0' // 212 14 97
const grey_1 = '#9CA7B3' // 212 13 66
const grey_2 = '#818C99' // 212 11 55
const grey_9 = '#313539' // 212 8  21
const black = '#000' // 0 0 24
const white = '#FFF' // 0 0 100
const main = '&main'
const white_015 = '#505357'
const white_02 = '#5A5D61'
const white_05 = '#989A9C'
const white_06 = '#ADAEB0'

export default function ({ type, preset }) {
  return Object.assign(
    {
      card_img: '',
      border_radius: 8,
    },
    {
      white: white,
      card_bg: main,
      card_label_color: white,
      card_input_color: white,
      card_input_shadow: black,
      btn_success_color: white,
      btn_success_bg: main,
    },
    {
      light: {
        main_color: grey_2,
        container_bg: white,
        card_shadow: main,
        btn_success_shadow: main,
        link_color: grey_2,
        scrollbar_thumb_bg: ash_500,
        outline_border: grey_1,
        outline_bg: ash_300,
      },
      dark: {
        main_color: white_05,
        container_bg: grey_9,
        card_shadow: black,
        btn_success_shadow: black,
        link_color: white_05,
        scrollbar_thumb_bg: white_02,
        outline_border: white_06,
        outline_bg: white_015,
      },
    }[type],
    presets[preset] || { main: preset }
  )
}
