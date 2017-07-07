/**
 * @author: hankaibo
 */
const commonConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');

/*
 * Webpack Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackMerge = require('webpack-merge');

module.exports = function (env) {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('prod')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      }),
      new CopyWebpackPlugin([{
        from: 'src/assets/',
        to: 'assets'
      }, {
        from: 'src/meta',
        to: 'meta'
      }])
    ]
  })
};
