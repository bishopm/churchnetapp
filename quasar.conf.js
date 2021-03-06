// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'axios',
      'firebase',
      'vuelidate',
      'frappe'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      // 'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],

    framework: {
      importStrategy: 'auto',

      components: [
        'QBadge',
        'QCard',
        'QCardActions',
        'QChip',
        'QColor',
        'QDate',
        'QDialog',
        'QCardSection',
        'QCheckbox',
        'QEditor',
        'QExpansionItem',
        'QField',
        'QForm',
        'QLayout',
        'QHeader',
        'QInput',
        'QFooter',
        'QDrawer',
        'QOptionGroup',
        'QMarkupTable',
        'QPageContainer',
        'QPage',
        'QPageSticky',
        'QPopupProxy',
        'QRadio',
        'QTable',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnDropdown',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QSelect',
        'QSeparator',
        'QSpace',
        'QTabs',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QToolbar',
        'QTd',
        'QTime',
        'QUploader',
        'QUploaderAddTrigger'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'Dialog'
      ],
      iconSet: 'fontawesome-v5'
      // lang: 'de' // Quasar language
    },

    build: {
      env: ctx.dev
        ? { // so on dev we'll have
          API: 'http://localhost/churchnet/public/api',
          WEB: 'http://localhost/churchnet/public'
        }
        : { // and on build (production):
          API: 'https://church.net.za/api',
          WEB: 'https://church.net.za'
        },
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
