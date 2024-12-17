const webpackPreprocessor = require('@cypress/webpack-preprocessor')

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: require('./webpack.config.cypress'),
      }

      on('file:preprocessor', webpackPreprocessor(options))
      return config
    },
    specPattern: '**/*.spec.js',
  },
}
