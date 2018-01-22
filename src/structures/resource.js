import _get from 'lodash/get'
import _set from 'lodash/set'
import Base from './base'

const DEFAULT_ACTIONS = {
  create: {
    config: { method: 'post' }
  },
  fetch: {}
}

const DEFAULT_OPTIONS = {
  customRules: null,
  identifier: 'id',
  mutateBeforeSync: true,
  mutateOnChange: false,
  routeParameterPattern: /\{([^}]+)\}/,
  routeParameterURL: '$url'
}

export default class Resource extends Base {
  constructor () {
    super()

    this._pending = false
    this._defaults = { actions: DEFAULT_ACTIONS }
    this._routeParams = {}
    this._route = this.routes().resource
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())

    this._registerActions()

    this.boot()
  }

  new (attributes) {
    const Member = this.member()

    return new Member(attributes, this)
  }

  stub (identifier) {
    const Member = this.member()
    const stub = new Member(null, this)
    const key = this.getOption('identifier')

    stub.set(key, identifier)

    return stub
  }

  // interface

  actions () {
    return {}
  }

  axios () {
    return {}
  }

  boot () {}

  member () {}

  options () {
    return {}
  }

  routes () {
    const actionURL = this.getOption('routeParameterURL')

    return {
      resource: '{' + actionURL + '}',
      member: '/{id}{' + actionURL + '}'
    }
  }

  // states

  pending () {
    return this._pending
  }

  // methods

  getOption (path, fallback) {
    return _get(this._options, path, fallback)
  }

  setOption (path, value) {
    return _set(this._options, path, value)
  }

  // private

  _getRouteParameters (defaults = {}) {
    return Object.assign({}, this._routeParams, defaults)
  }
}
