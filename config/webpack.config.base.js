/**
 * @author: hankaibo
 */
const path = require('path');
const webpack = require('webpack');

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.NODE_ENV;
var isProd = ENV === 'prod';

module.exports = function () {
  return {
    entry: {
      polyfills: './src/polyfills.js',
      vendor: './src/vendor.js',
      main: './src/main.js'
    },
    output: {
      path: path.join(__dirname, '/../dist/'),
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
      sourceMapFilename: '[name].map'
    },
    // resolve: {
    //   extensions: ['', '.ts', '.js', '.json'],
    //   modules: [path.join(__dirname, 'src'), 'node_modules']
    // },
    module: {
      rules: [{
        test: /\.ts$/,
        use: ['awesome-typescript-loader', ],
        exclude: [/\.(spec|e2e)\.ts$/]
      }, {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      }, {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      }, {
        test: /\.(woff|woff2|eof|ttf|svg)$/,
        use: 'url-loader?limit=10000'
      }]
    },
    plugins: [
      new AssetsPlugin({
        path: path.join(__dirname, '/../dist/'),
        filename: 'assets.json',
        prettyPrint: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'manifest'],
        minChunks: Infinity
      }),
      new webpack.HashedModuleIdsPlugin(),
      new ChunkManifestPlugin({
        filename: 'manifest.json',
        manifestVariable: 'webpackManifest',
        inlineManifest: false
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        chunksSortMode: 'dependency'
      })
    ]
  }
}
