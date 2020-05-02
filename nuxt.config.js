const config = {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/fda42037e8.js',
        crossorigin: 'anonymous',
      },
      'https://cdn.quilljs.com/1.3.5/quill.bubble.css',
    ],
  },

  router: {
    // middleware: 'auth'
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [
    { src: '~plugins/quill.js', mode: 'client' },
    '~plugins/sanitize-html.js',
    '~plugins/firebase.js',
    { src: '~plugins/browser-image-compression.js', mode: 'client' },
    '~plugins/common/resizeImg.js',
    '~plugins/common/timestampToDate.js',
  ],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  axios: {},
  build: {
    babel: {
      presets({ isServer }) {
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
    extend(config, { isDev, isClient, isServer }) {
      if (isServer) {
        config.externals = {
          '@firebase/app': 'commonjs @firebase/app',
          '@firebase/auth': 'commonjs @firebase/auth',
          '@firebase/firestore': 'commonjs @firebase/firestore',
          '@firebase/storage': 'commonjs @firebase/storage',
        }
      }
    },
  },
}

if (process.env.NODE_ENV === 'development') {
  config.buildModules.push('@nuxtjs/eslint-module')
  config.modules.push('@nuxtjs/dotenv')
  config.modules.push('@nuxtjs/proxy')
  config.axios = { proxy: true }
  config.proxy = { '/api': 'http://localhost:3333' }
  config.server = { port: 3333 }
}

export default config
