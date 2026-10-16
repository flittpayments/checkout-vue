import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import babelParser from '@babel/eslint-parser'

export default [
  {
    ignores: ['src/i18n/process/**', 'src/i18n/po/**', 'dist/**'],
  },
  js.configs.recommended,
  ...vue.configs['flat/vue2-recommended'],
  eslintConfigPrettier,
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: babelParser,
        requireConfigFile: false,
      },
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
