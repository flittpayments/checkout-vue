import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { messages as messagesEn, validate as validateEn } from '@/i18n/lang/en'
import { localize } from 'vee-validate'
import configLocales from '@/config/locales.json'
import { loadLang } from '@/import'
import { api } from '@/api'
import { getCookie } from '@/utils/helpers'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
})

export const loadLanguageAsync = (lang, store) =>
  loadLang(lang).then(({ messages, validate }) => {
    const translation = {
      ...messagesEn,
      ...store.state.messages['en'],
      ...messages,
      ...store.state.messages[lang],
    }

    localize(lang, {
      messages: Object.assign(
        {},
        validateEn,
        validate,
        store.state.validate[lang]
      ),
    })

    i18n.setLocaleMessage(lang, translation)

    return setI18nLanguage(lang)
  })

function setI18nLanguage(lang) {
  i18n.locale = lang

  if (api?.extendParams) {
    api.extendParams({
      messages: {
        modalHeader: i18n.t('3ds_title'),
        modalLinkLabel: i18n.t('3ds_link'),
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
  let n = window.navigator
  const value = (n.language || n.browserLanguage || '')
    .toLowerCase()
    .split('-')[0]
  return isSupportLang(value) ? value : 'en'
}

export const isSupportLang = value => Object.keys(configLocales).includes(value)
