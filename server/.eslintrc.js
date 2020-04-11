// Linting is only run on .js files by default unless passed the --ext= flag.
module.exports = {
  // Draws from eslint-config-X packages to use custom settings on pre-existing rules.
  // However, you can also apply plugin rules to the core rules with the prefix "plugin:",
  // which is what is being done with "plugin:jest/recommended".
  extends: ['airbnb-base', 'plugin:jest/recommended', 'prettier'],
  // Draws from eslint-plugin-X packages to add entirely new rules
  plugins: ['import', 'prettier'],
  env: {
    // Allows for use of node global variables and node scoping
    node: true,
    // Allows for the use of jest global values during testing
    jest: true,
  },
  parserOptions: {
    // Identify that our code is not in ECMAScript
    sourceType: 'script',
  },
  rules: {
    // Require that we say 'use strict' at the top of each file. 'safe' is interpreted
    // to mean 'global' (as in require 'use strict' at the global scope of each module)
    // because we have set the environment to node, and node does not run modules in
    // strict mode by default because it uses CommonJS instead of ECMAScript modules.
    // This is reiterated in parserOptions because oddly, even though 'script' is the
    // default value, this 'strict' rule would not apply without it.
    'strict': ['error', 'global'],
    'prettier/prettier': ['error'],
    'consistent-return': 0
  },
}
