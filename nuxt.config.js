const config = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/fda42037e8.js',
        crossorigin: 'anonymous'
      }
    ]
  },

  router: {
    // middleware: 'auth'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/quill.js', ssr: false },
    '~plugins/sanitize-html.js',
    '~plugins/firebase.js',
    '~plugins/common/resizeImg.js',
    '~plugins/common/timestampToDate.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  // auth: {
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: {
  //           url: 'api/v1/user_token',
  //           method: 'post',
  //           propertyName: 'jwt'
  //         },
  //         user: { url: 'api/v1/users', method: 'get', propertyName: 'user' },
  //         logout: false
  //       }
  //     }
  //   },
  //   redirect: {
  //     login: '/login',
  //     logout: '/login',
  //     callback: false,
  //     home: '/'
  //   }
  // },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
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
