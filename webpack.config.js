/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const webpackNodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpackbar = require('webpackbar');
const slsw = require('serverless-webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

const configFile = resolve(__dirname, './tsconfig.build.json');

const outputDir = resolve(__dirname, '../.webpack');

module.exports = {
  // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  mode: 'production',
  target: 'node',
  externals: [webpackNodeExternals()],
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs2',
    path: outputDir,
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile,
      }),
    ],
  },
  stats: 'minimal',
  plugins: [
    new webpackbar({
      name: `[Lambda] Bridg Core`,
    }),
    new copyWebpackPlugin({
      patterns: [resolve(__dirname, 'prisma/schema.prisma')],
    }),
  ],
};
