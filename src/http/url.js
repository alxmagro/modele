import interpolate from 'interpolate-url'
import join from 'join-path'

export default class URL {
  constructor (...params) {
    const paths = params.filter(path => path).map(path => path.toString())

    this.url = paths.length ? join(...paths) : null
  }

  static new (...params) {
    return new this(...params)
  }

  solve (map = {}) {
    return interpolate(this.url, map)
  }
}
