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
  mutateBeforeSave: true,
  mutateBeforeSync: true,
  mutateOnChange: false,
  routeParameterPattern: /\{([^}]+)\}/,
  routeParameterURL: '$url',
  validateMutatedAttributes: true
}

export default class Resource extends Base {
  constructor () {
    super()

    this._defaultActions = DEFAULT_ACTIONS
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
    this._pending = false
    this._route = this.routes().resource
    this._routeParams = {}

    this._registerActions()

    this.boot()
  }

  new (attributes) {
    const Member = this.member()

    return new Member(attributes, this)
  }

  stub (key) {
    const Member = this.member()
    const stub = new Member(null, this)
    const identifier = this.getOption('identifier')

    stub.set(identifier, key)

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
    const identifier = this.getOption('identifier')

    return {
      resource: '{' + actionURL + '}',
      member: '/{' + identifier + '}{' + actionURL + '}'
    }
  }

  // getters

  get pending () {
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
