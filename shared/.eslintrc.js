module.exports = {
  env: {
    // Allows for use of node global variables and node scoping
    node: true
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
  },
};
