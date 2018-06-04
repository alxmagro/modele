const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  target: 'node',
  node: {
    process: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'modele',
    libraryTarget: 'umd',
    filename: 'modele.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}