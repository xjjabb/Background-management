module.exports= {
    "devServer": {
        "port": 8080,
        "open": true
    },
    configureWebpack: {
        resolve: {
          alias: {
            'assets': '@/assets',
            'common': '@/common',
            'components': '@/components',
            'http': '@/http',
            'view': '@/view',
            'store': '@store'
          }
        }
      }
}