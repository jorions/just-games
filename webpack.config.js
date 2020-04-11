require('dotenv').config()

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { resolve } = require('./webpack.config.resolve')

const inDevMode = process.env.NODE_ENV === 'development'
const mode = inDevMode ? 'development' : 'production'

const extraPlugins = []
if (process.env.SHOW_BUNDLE_SIZE) extraPlugins.push(new BundleAnalyzerPlugin())

module.exports = {
  // The entry point for webpack to begin traversing imports/dependencies for
  // combining into 1 file.
  entry: ['./src/index.jsx'],
  output: {
    filename: 'bundle.js',
    // chunkFilename determines the use name of non-entry chunk files. These filenames
    // are generated at runtime, which then sends requests for those chunks.
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  // The mode not only indicates to webpack and 3rd party packages whether to enable
  // or disable certain features, but also sets process.env.NODE_ENV = mode in
  // the browser.
  mode,
  // Generates a source map of the bundle.js, so that you can see which file an
  // error, console.log, etc comes from, instead of seeing everything as coming
  // from the bundle.js. The "eval-" version of the source map only runs in
  // development, which is why we use it here - we don't want to allow normal
  // users to see the source map.
  devtool: 'eval-source-map',
  // Defines the options for webpack-dev-server
  devServer: {
    port: 5051,
    // Set a base path that content not from webpack is served from
    contentBase: path.resolve(__dirname, 'public'),
    // Make sure that all routes we hit will serve our index.html
    historyApiFallback: true,
    // By default webpack-dev-server only accepts requests with the same host name
    // as where it is running from (localhost). So if we want to use ngrok or some
    // similar tech to access the website using a non-"localhost" url, we can't.
    // So use this setting to stop that host checking.
    disableHostCheck: true,
    // This makes the webpack-dev-server accessible by other devices if those devices
    // try to access the server via the IP address of the host machine. This allows
    // cross-device testing without ngrok, but requires knowing the host IP address.
    // On mac, simply say "ifconfig | grep inet" and use the IP address of the last
    // "inet" line. Ex: "192.168.1.128:8080"
    host: '0.0.0.0',
    // Hide child entry point stats, removing the console msg  "Entrypoint undefined = index.html"
    stats: { children: false },
  },
  module: {
    // Rules defining which files ("test:"/"exclude:") to use ("use:") certain code
    // loaders (aka transformers) on. The "test"s are run on the file path which
    // resolves in a given import or require() statement, and the transformer is
    // used on the file that lives at that path.
    // These are used because Webpack can only process JavaScript natively, so
    // loaders are used to transform other resources into JavaScript. By doing so,
    // every resource forms a module.
    rules: [
      {
        test: /\.(js|jsx)$/,
        // We do not transpile node_modules because we assume they are already transpiled
        exclude: /node_modules/,
        use: [
          {
            // This uses the .babelrc file for its config
            // - In that file, we specify [env, modules: false]
            // - "env" replaces older babel-preset-2015/16/17 packages
            // - "module: false" indicates that babel should leave module importing
            // alone, so that so long as we use ES2015 "import" syntax instead
            // of Node's more commonJS-esque "require" syntax, Webpack tree shaking
            // (which does not work with "require") will still work. It is OK to
            // use the ES2015 import syntax, even though it doesn't work in browsers,
            // because all of our code is being combined into 1 file, so importing
            // doesn't matter.
            // (https://insights.untapt.com/webpack-import-require-and-you-3fd7f5ea93c0)
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            // This turns any html file into a module and requires any image
            // dependency along the way. This way you can use require('./someHtml.html')
            // and require('./someImage.jpg) directly in your code.
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        include: [/index.css/],
        use: [
          // 'style-loader' takes all imported CSS and injects it into a <style> tag
          // in the <head> of the index.html.
          //
          // 'MiniCssExtractPlugin.loader' extracts all CSS into separate files
          // from the bundle.js. This improves performance because:
          // - By default webpack puts all CSS inline in the bundle.js, which leads
          // to a larger bundle.
          // - CSS files are loaded in parallel with JS, so having separate JS and CSS
          // files takes advantage of this parallel loading.
          //
          // We use style-loader in development because because it supports hot
          // reloading, while MiniCSSExtractPlugin.loader doesn't yet.
          inDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          // Interprets and resolves @import and url() statements in CSS.
          {
            loader: 'css-loader',
            options: {
              // The # of css loaders applied before this loader (postcss-loader)
              importLoaders: 1,
            },
          },
          // Loads PostCSS into webpack, and uses it to read our CSS. It is used
          // to transform CSS with JS plugins. This includes transforming new
          // syntax into old syntax. We specify the PostCSS features we want to
          // use in postcss.config.js.
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /index.css/],
        use: [
          inDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // Enable local scoping of css classes - this naming matches the
              // naming defined in the .babelrc. The .babelrc uses babel-plugin-react-css-modules
              // to enable the use of the styleName prop in components.
              modules: {
                localIdentName: inDevMode ? '[name]_[local]_[hash:base64:5]' : '[hash:base64]',
              },
            },
          },
          'postcss-loader',
        ],
      },
      // Enables importing/requiring images directly in JS. For each imported file,
      // it emits a file in the output directory. As far as the browser can see,
      // the folder structure of the saved images matches the folder structure
      // they were imported from in relation to this config file.
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: inDevMode ? '[path][name].[hash].[ext]' : '[name].[hash].ext',
        },
      },
    ],
  },
  resolve,
  plugins: [
    // Takes a template HTML file, copies that template, adds a <script> tag in that
    // copy which points to our bundle.js, and finally places the copied HTML file
    // in the same directory as the bundle.js.
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.ico',
    }),
    // Defines the names of the CSS files we would like to give to the files
    // generated by the MiniCssExtractPlugin plugin. In development we use 'style-loader'
    // so we do not to apply the plugin in that case.
    inDevMode
      ? () => {}
      : new MiniCssExtractPlugin({
          filename: '[name].[hash].css',
          chunkFilename: '[id].[hash].css',
        }),
    // Passes process.env values into the browser's node process
    new webpack.DefinePlugin({
      'process.env': {
        IN_DEV_MODE: JSON.stringify(inDevMode),
        SERVER_URL: JSON.stringify(process.env.SERVER_URL),
      },
    }),
    ...extraPlugins,
  ],
  // Uses default Webpack settings for splitting our bundle up. With this default it will
  // split our app from our vendor files (bundle.js vs vendors~main.bundle.js).
  // This works in tandem with the output.chunkFilename option used above.
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
