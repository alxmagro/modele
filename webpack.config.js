const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/modele.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'modele',
    libraryTarget: 'umd',
    filename: 'modele.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new UglifyJSPlugin()
  ]
}