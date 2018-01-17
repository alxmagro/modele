import _ from 'lodash'
import Base from './base'

const DEFAULT_ACTIONS = {
  fetch: {},
  create: {
    config: { method: 'post' }
  }
}

const DEFAULT_OPTIONS = {
  identifier: 'id',
  mutateOnChange: false,
  requestOptions: {},
  routeParameterPattern: /\{([^}]+)\}/,
  routeParameterURL: '$url',
  ruleset: null
}

export default class Resource extends Base {
  constructor (attributes = {}) {
    super()

    this._pending = false
    this._defaults = { actions: DEFAULT_ACTIONS }
    this._routeParams = {}
    this._route = this.routes().resource
    this._options = _.merge({}, DEFAULT_OPTIONS, this.options())

    this._registerActions()

    this.boot()
  }

  stub (identifier) {
    const Member = this.member()
    const stub = new Member(null, this)
    const key = this.getOption('identifier')

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

  options () {
    return {}
  }

  actions () {
    return {}
  }

  routes () {
    const actionURL = this.getOption('routeParameterURL')

    return {
      resource: '{' + actionURL + '}',
      member: '/{id}{' + actionURL + '}'
    }
  }

  // methods

  getOption (path, fallback) {
    return _.get(this._options, path, fallback)
  }

  setOption (path, value) {
    return _.set(this._options, path, value)
  }

  // private

  _getRouteParameters (defaults = {}) {
    return _.merge({}, this._routeParams, defaults)
  }
}
