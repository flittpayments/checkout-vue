import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['src/i18n/process/**', 'tests/**'],
  },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,

        API_DOMAIN: 'readonly',
        COMMITHASH: 'readonly',
        DOMAIN: 'readonly',
        ENVIRONMENT: 'readonly',
        INITIATOR: 'readonly',
        PUBLIC_PATH: 'readonly',
        SAAS_CDN_URL: 'readonly',
        SAAS_TEMPLATE_NAME: 'readonly',
        SENTRY_DSN: 'readonly',
        VERSION: 'readonly',
        X_PAYMENT_GATEWAY: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-useless-escape': 'off',
      'no-var': 'error',

      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'prettier/prettier': 'error',
    },
  },
]
