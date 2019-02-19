// Configuration for your app
var version = JSON.stringify('0.2.9')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'axios',
      'maps',
      'vuelidate',
      'firebase',
      'frappe'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'fontawesome'
    ],
    supportIE: false,
    build: {
      env: ctx.dev
        ? { // so on dev we'll have
          API: JSON.stringify('http://localhost/churchnet/public/api'),
          WEB: JSON.stringify('http://localhost/churchnet/public'),
          VERSION: version
        }
        : { // and on build (production):
          API: JSON.stringify('https://church.net.za/api'),
          WEB: JSON.stringify('https://church.net.za'),
          VERSION: version
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
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QAutocomplete',
        'QBtn',
        'QChip',
        'QDatetime',
        'QEditor',
        'QField',
        'QIcon',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QList',
        'QListHeader',
        'QModal',
        'QPageContainer',
        'QPageSticky',
        'QPage',
        'QPopupEdit',
        'QPullToRefresh',
        'QRadio',
        'QSearch',
        'QSelect',
        'QTable',
        'QToggle',
        'QTh',
        'QTr',
        'QTd',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QToolbar',
        'QToolbarTitle',
        'QUploader'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Dialog',
        'Notify',
        'Loading'
      ],
      config: {
        notify: {
          color: 'black'
        }
      },
      iconSet: 'fontawesome'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
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
