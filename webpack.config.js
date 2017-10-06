const path = require('path')
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
    new UglifyJSPlugin()
  ],
  externals: [
    {
      'isomorphic-fetch': {
        root: 'isomorphic-fetch',
        commonjs2: 'isomorphic-fetch',
        commonjs: 'isomorphic-fetch',
        amd: 'isomorphic-fetch'
      }
    }
  ]
}