// Linting is only run on .js/.jsx files because our package.json runs eslint with
// the flag --ext=js,jsx
module.exports = {
  // Draws from eslint-config-X packages to use custom settings on pre-existing rules.
  // However, you can also apply plugin rules to the core rules with the prefix "plugin:",
  // which is what is being done with "plugin:react/recommended" to remove the no-unused-vars
  // error from react imports/exports.
  extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:react/recommended'],
  // Draws from eslint-plugin-X packages to add entirely new rules
  plugins: ['import', 'jsx-a11y', 'prettier', 'react'],
  env: {
    // Allows for use of browser global variables like "window", etc
    browser: true,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/webpack.config.js', '**/postcss.config.js'] },
    ],
    'prettier/prettier': ['error'],
    'react/no-unescaped-entities': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'consistent-return': 0,
  },
  // ESLint does not support experimental ECMAScript features, but we have configured
  // babel to support some experimental features (like class arrow functions). So
  // we should use babel's settings to dictate ESLint's parsing
  parser: 'babel-eslint',
  settings: {
    // This setting is enabled by eslint-import-resolver-webpack
    // It imports the given file to understand webpack's configured import aliases
    'import/resolver': {
      // Add 'node' to fix a conflict with the no-extraneous-dependencies rule that
      // appears when when importing node core libs while using resolvers
      // https://github.com/benmosher/eslint-plugin-import/issues/1396
      node: {},
      webpack: {
        config: './webpack.config.resolve.js',
      },
    },
  },
}
