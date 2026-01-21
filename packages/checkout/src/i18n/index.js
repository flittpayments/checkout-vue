import { createI18n } from 'vue-i18n'
import { messages as messagesEn } from '@/i18n/lang/en'
import { configure } from 'vee-validate'
import configLocales from '@/config/locales.json'
import { loadLang } from '@/import'
import { api } from '@/api'
import { getCookie } from '@/utils/helpers'
import { localize } from '@vee-validate/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  missingWarn: false,
  warnHtmlMessage: false,
  fallbackWarn: false,
})

export const loadLanguageAsync = (lang, store) =>
  loadLang(lang).then(({ messages }) => {
    const translation = {
      ...messagesEn,
      ...store.state.messages['en'],
      ...messages,
      ...store.state.messages[lang],
    }

    const veeMessages = Object.fromEntries(
      Object.entries(translation)
        .filter(([key]) => key.startsWith('rule_'))
        .map(([key, value]) => [key.slice(5), value])
    )

    configure({
      generateMessage: localize(lang, {
        messages: veeMessages,
      }),
    })

    i18n.global.setLocaleMessage(lang, translation)

    return setI18nLanguage(lang)
  })

function setI18nLanguage(lang) {
  i18n.global.locale.value = lang

  if (api?.extendParams) {
    api.extendParams({
      messages: {
        modalHeader: i18n.global.t('3ds_title'),
        modalLinkLabel: '',
      },
    })
  }

  return lang
}

export const getCookieLanguage = () => {
  const value = getCookie('lang_s')
  return isSupportLang(value) ? value : ''
}

export const getBrowserLanguage = () => {
  const n = window.navigator
  const value = (n.language || n.browserLanguage || '')
    .toLowerCase()
    .split('-')[0]
  return isSupportLang(value) ? value : 'en'
}

export const isSupportLang = value => Object.keys(configLocales).includes(value)
