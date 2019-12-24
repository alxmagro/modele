import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const base = {
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [["@babel/env", { "modules": false }]],
      exclude: ["node_modules/**/*"]
    })
  ]
}

const main = Object.assign({}, base, {
  input: 'src/core/model',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' }
  ]
})

const validations = Object.assign({}, base, {
  input: 'src/validations',
  output: [
    { file: 'dist/validations/index.js', format: 'cjs' },
    { file: 'dist/validations/index.esm.js', format: 'esm' }
  ]
})

export default [
  main,
  validations
]
