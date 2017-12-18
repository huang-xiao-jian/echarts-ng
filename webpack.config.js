/**
 * @description - webpack development configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client/?http://0.0.0.0:8100',
    'webpack/hot/dev-server',
    './public/app.js'
  ],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: 'script/[name].bundle.js',
    chunkFilename: 'script/[id][name].chunk.js'
  },
  externals: {
    echarts: true,
    angular: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              root: path.resolve(process.cwd(), 'src')
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:lib'],
              root: path.resolve(process.cwd(), 'src')
            }
          }
        ]
      }
    ]
  },
  plugins: [
    Reflect.construct(webpack.HotModuleReplacementPlugin, []),
    Reflect.construct(HtmlWebpackPlugin, [{
      template: path.resolve(process.cwd(), 'public', 'index.html'),
      inject: 'body'
    }])
  ],
  devServer: {
    contentBase: './dist/',
    quiet: false,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8100,
    disableHostCheck: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    stats: {
      colors: true
    }
  }
};
