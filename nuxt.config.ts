import { Configuration } from '@nuxt/types'
import {
  Configuration as WebpackConfiguration,
  // Options as WebpackOptions,
  // Plugin as WebpackPlugin
} from 'webpack'

// import pkg from './package'
require('dotenv').config()

const config: Configuration = {
  mode: 'universal',
  head: {
    // title: process.env.npm_package_name || '',
    titleTemplate: '%s - スキゾイド帳',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      // { hid: 'description', name: 'description', content: this.meta.description },
      // { hid: 'og:description', property: 'og:description', content: this.meta.description },

      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'スキゾイド帳',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://schizoid-note.com',
      },
      { hid: 'og:title', property: 'og:title', content: 'スキゾイド帳' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://schizoid-note.com/img/schizoid-chan.png',
      },
      // { property: 'article:publisher', content: 'FacebookURL' },
      // { property: 'fb:app_id', content: 'FacebookAppID' },
      { name: 'twitter:card', content: 'summary' },
      // { name: 'twitter:site', content: '@Twitter' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/fda42037e8.js',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://cdn.quilljs.com/1.3.5/quill.bubble.css',
      },
    ],
  },
  env: {
    VUE_APP_apiKey: process.env.VUE_APP_apiKey || '',
    VUE_APP_authDomain: process.env.VUE_APP_authDomain || '',
    VUE_APP_databaseURL: process.env.VUE_APP_databaseURL || '',
    VUE_APP_projectId: process.env.VUE_APP_projectId || '',
    VUE_APP_storageBucket: process.env.VUE_APP_storageBucket || '',
    VUE_APP_messagingSenderId: process.env.VUE_APP_messagingSenderId || '',
    VUE_APP_appId: process.env.VUE_APP_appId || '',
  },

  router: {},
  loading: { color: '#fff' },
  css: ['~/assets/scss/_index.scss'],
  plugins: [
    { src: '~plugins/quill.js', mode: 'client' },
    '~plugins/sanitize-html.js',
    '~plugins/firebase.js',
    { src: '~plugins/browser-image-compression.js', mode: 'client' },
    '~plugins/common/timestampToDate.js',
  ],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-100824002-2',
      },
    ],
  ],
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },
  styleResources: {
    scss: ['~/assets/scss/_common.scss'],
  },
  axios: {},
  build: {
    babel: {
      presets({ isServer }: any) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ]
      },
    },
    extend(config: WebpackConfiguration, { isServer }: any) {
      if (isServer) {
        config.externals = {
          '@firebase/app': 'commonjs @firebase/app',
          '@firebase/auth': 'commonjs @firebase/auth',
          '@firebase/firestore': 'commonjs @firebase/firestore',
          '@firebase/storage': 'commonjs @firebase/storage',
        }
      }
      // Run ESLint on save
      // if (isDev && isClient) {
      //   config?.module?.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/,
      //   })
      // }
    },
  },
}

export default config
