const postcssPresetEnv = require('postcss-preset-env')

// postcssPresetEnv transforms our css into browser-agnostic polyfills
module.exports = {
  plugins: [postcssPresetEnv],
}
