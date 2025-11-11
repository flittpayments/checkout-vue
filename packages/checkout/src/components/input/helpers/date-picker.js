import DatePicker from 'vue2-datepicker'
import { mask } from '@/utils/mask'

export default {
  extends: DatePicker,
  inheritAttrs: false,
  watch: {
    userInput(newValue) {
      let value = mask(newValue, this.format.replace(/\w/g, '#'), true)
      if (newValue !== value) {
        this.userInput = value || null
      }
    },
  },
}
