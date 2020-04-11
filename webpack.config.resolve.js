const path = require('path')

// Defines how to handle file paths and extensions. This does not need to be
// specified for default .js behavior, but because we are adding .jsx and aliases
// we want it for convenience

const alias = {
  apps: path.resolve(__dirname, 'src/apps'),
  components: path.resolve(__dirname, 'src/components'),
  lib: path.resolve(__dirname, 'src/lib'),
  models: path.resolve(__dirname, 'src/models'),
  routes$: path.resolve(__dirname, 'src/routes.js'),
  shared: path.resolve(__dirname, 'shared'),
}

// Alias react-dom calls to use a hot-reloading version of react-dom
if (process.env.NODE_ENV === 'development') alias['react-dom'] = '@hot-loader/react-dom'

// Return a nested resolve key so that eslint-import-resolver-webpack can read it
module.exports = {
  resolve: {
    // Maps shorthand import strings to full file paths
    // - For ex: 'lib/storage' instead of '../../lib/storage'
    alias,
    // Defines which file extensions should be resolved automatically.
    // - Without this, we would need to add '.jsx' to each import statement. Now,
    // it resolves automatically, allowing Webpack to turn it into a JS file.
    extensions: ['.js', '.jsx'],
  },
}
