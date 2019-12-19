import resolve    from '@rollup/plugin-node-resolve'
import babel      from 'rollup-plugin-babel'
import commonjs   from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'

const base = {
  input: 'src',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      exclude: ['node_modules/**'],
      presets: ['@babel/env']
    })
  ]
}

const main = Object.assign({}, base, {
  input: 'src/core/model',
  output: [
    { file: 'dist/modele.cjs.js', format: 'cjs' },
    { file: 'dist/modele.esm.js', format: 'esm' },
    {
      file: 'dist/modele.js',
      format: 'umd',
      name: 'Modele'
    },
    {
      file: 'dist/modele.min.js',
      format: 'umd',
      name: 'Modele',
      plugins: [terser(), uglify()]
    }
  ]
})

const validations = Object.assign({}, base, {
  input: 'src/validations',
  output: [
    { file: 'dist/validations/index.cjs.js', format: 'cjs' },
    { file: 'dist/validations/index.esm.js', format: 'esm' },
    {
      file: 'dist/validations/index.js',
      format: 'umd',
      name: 'ModelValidations'
    },
    {
      file: 'dist/validations/index.min.js',
      format: 'umd',
      name: 'ModelValidations',
      plugins: [terser(), uglify()]
    }
  ]
})

export default [
  main,
  validations
]
