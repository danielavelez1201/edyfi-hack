module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify')
    }
  },
  webpack5: false
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false, crypto: false }
  //   //   config.experiments = { topLevelAwait: true }
  //   //   config.resolve.alias.https = 'https-browserify'
  //   //   config.resolve.alias.http = 'http-browserify'
  //   config.resolve.mainFields = ['browser']
  //   return config
}
