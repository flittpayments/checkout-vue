import translation from '@/i18n/po/uz/messages.json'
import countries from '@/i18n/countries/uz.json'
import locales from '@/config/locales.json'
import { clearEmptyValue } from '@/utils/helpers'

export const messages = Object.assign(
  {},
  countries,
  locales,
  clearEmptyValue(translation),
  {
    datepicker: {
      formatLocale: {
        months: [
          'yanvar',
          'fevral',
          'mart',
          'aprel',
          'may',
          'iyun',
          'iyul',
          'avgust',
          'sentabr',
          'oktabr',
          'noyabr',
          'dekabr',
        ],
        monthsShort: [
          'yan',
          'fev',
          'mar',
          'apr',
          'may',
          'iyn',
          'iyl',
          'avg',
          'sen',
          'okt',
          'noy',
          'dek',
        ],
        weekdays: [
          'yakshanba',
          'dushanba',
          'seshanba',
          'chorshanba',
          'payshanba',
          'juma',
          'shanba',
        ],
        weekdaysShort: ['yak', 'du', 'se', 'cho', 'pay', 'ju', 'sha'],
        weekdaysMin: ['ya', 'du', 'se', 'cho', 'pa', 'ju', 'sha'],
        firstDayOfWeek: 1,
        firstWeekContainsDate: 1,
      },
      yearFormat: 'YYYY',
      monthFormat: 'MMM',
      monthBeforeYear: true,
    },
  }
)
