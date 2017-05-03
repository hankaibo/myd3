/**
 * @author: hankaibo
 */
const path = require('path');
const helpers = require('./helpers');
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
  var config = {};
  // 多入口
  var entries = helpers.getEntry('src/app/views/**/*.js', 'src/app/views/');

  // 配置
  config.entry = entries;
  config.output = {
    path: helpers.root('../dist'),
    filename: isProd ? 'app/views/[name].[chunkhash].js' : 'app/views/[name].js',
    chunkFilename: isProd ? 'app/views/[name].[chunkhash].js' : 'app/views/[name].js'
  };
  config.resolve = {
    extensions: ['.js', '.json'],
    modules: [helpers.root('../src'), 'node_modules']
  };
  config.module = {
    rules: [{
      test: /\.css$/,
      use: ['to-string-loader', 'css-loader']
    }, {
      test: /\.(jpg|png|gif)$/,
      use: 'file-loader'
    }, {
      test: /\.(woff|woff2|eof|ttf|svg)$/,
      use: 'url-loader?limit=10000'
    }]
  };
  config.plugins = [
    new AssetsPlugin({
      path: helpers.root('/../dist/'),
      filename: 'assets.json',
      prettyPrint: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['manifest'],
    //   minChunks: Infinity
    // }),
    new webpack.HashedModuleIdsPlugin(),
    new ChunkManifestPlugin({
      filename: 'manifest.json',
      manifestVariable: 'webpackManifest',
      inlineManifest: false
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    })
  ];
  // 多模板
  var pages = Object.keys(helpers.getEntry('src/app/views/**/*.html', 'src/app/views/'));
  pages.forEach(function (pathname) {
    var conf = {
      filename: './app/views/' + pathname + '.html',
      template: 'src/app/views/' + pathname + '.html',
      inject: false
    };
    if (pathname in entries) {
      conf.favicon = 'src/assets/img/favicon.png';
      conf.inject = 'body';
      conf.chunks = [pathname];
      conf.hast = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
  });

  return config;
}
