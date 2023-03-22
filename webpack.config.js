/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/main',
  target: 'node',
  externals: {},
  stats: 'verbose',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        extractComments: false, // 是否将注释剥离到单独的文件中
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.error'], // 移除console
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        // 当遇到Can't resolve ...的问题时，可以尝试添加到lazyImports中。
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          });
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
    new CompressionWebpackPlugin({
      test: /\.(ts|js)$/i,
      threshold: 0,
      minRatio: 0.8,
      algorithm: 'gzip',
      // exclude
      // include
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProgressPlugin(),
  ],
};
