const path = require('path');

module.exports = {
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@api': path.resolve(__dirname, 'src/api'),
    },
    extensions: ['.js', '.vue', '.json'], // File extensions to resolve
  },
};
