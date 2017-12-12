import Base from './base'
import _ from 'lodash'
import URL from '../http/url'

const DEFAULT_ACTIONS = {
  fetch: {},
  create: {
    config: { method: 'post' }
  }
}

const DEFAULT_OPTIONS = {
  identifier: 'id',
  ruleset: null
}

export default class Resource extends Base {
  constructor (attributes = {}) {
    super()
    this._keys = {}
    this._setOptions()

    this.boot()
  }

  stub (identifier) {
    const Member = this.member
    const stub = new Member()
    const key = stub.getOption('identifier')

    stub.set(key, identifier)

    return stub
  }

  new (attributes) {
    const Member = this.member()

    return new Member(attributes, this)
  }

  // interface

  member () {}
  boot () {}

  api () {
    return {}
  }

  options () {
    return {}
  }

  actions () {
    return {}
  }

  // methods

  getOption (path, fallback) {
    return _.get(this._options, path, fallback)
  }

  setOption (path, value) {
    return _.set(this._options, path, value)
  }

  // private

  _actionConfigs () {
    return this.api()
  }

  _setOptions () {
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
  }

  _prepareRequest (config) {
    config.url = URL.new(config.url).solve(this._keys)
    config.baseURL = URL.new(config.baseURL).solve(this._keys)
  }

  _defaultActions () {
    return DEFAULT_ACTIONS
  }
}
