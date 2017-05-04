/**
 * @author: hankaibo
 */
const commonConig = require('./webpack.config.base.js');
const path = require('path');

/*
 * Webpack Plugins
 */
const webpackMerge = require('webpack-merge');

module.exports = function (env) {
  return webpackMerge(commonConig(), {
    devtool: 'cheap-module-source-map',
    devServer: {
      port: 8080,
      host: 'localhost',
      contentBase: './src',
      historyApiFallback: true,
      noInfo: false,
      stats: 'minimal'
    }
  })
};
