import resolve    from '@rollup/plugin-node-resolve'
import commonjs   from 'rollup-plugin-commonjs'
import babel      from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'

const base = {
  input: 'src/index.js',
  plugins: [
    resolve({ mainFields: ['module', 'main', 'browser'] }),
    commonjs(),
    babel({
      babelrc: false,
      presets: [
        '@babel/env'
      ],
      exclude: [
        'node_modules/**'
      ]
    })
  ]
}

const build = function (config) {
  return {
    input: base.input,
    output: config.output,
    plugins: base.plugins.concat(config.plugins || [])
  }
}

const builds = {
  cjs: {
    output: {
      file: 'build/modele.cjs.js',
      format: 'cjs'
    }
  },

  esm: {
    output: {
      file: 'build/modele.esm.js',
      format: 'esm'
    }
  },

  dev: {
    output: {
      file: 'build/modele.js',
      format: 'umd',
      name: 'modele'
    }
  },

  prod: {
    output: {
      file: 'build/modele.min.js',
      format: 'umd',
      name: 'modele'
    },
    plugins: [terser(), uglify()]
  }
}

export default [
  build(builds.cjs),
  build(builds.esm),
  build(builds.dev),
  build(builds.prod)
]
