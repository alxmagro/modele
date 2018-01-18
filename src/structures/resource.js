import _get from 'lodash/get'
import _merge from 'lodash/merge'
import _set from 'lodash/set'

import Base from './base'
import Modele from '../modele'

const DEFAULT_ACTIONS = {
  fetch: {},
  create: {
    config: { method: 'post' }
  }
}

export default class Resource extends Base {
  constructor (attributes = {}) {
    super()

    this._pending = false
    this._defaults = { actions: DEFAULT_ACTIONS }
    this._routeParams = {}
    this._route = this.routes().resource
    this._options = _merge({}, Modele.globals.options, this.options())

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
    return _get(this._options, path, fallback)
  }

  setOption (path, value) {
    return _set(this._options, path, value)
  }

  // private

  _getRouteParameters (defaults = {}) {
    return _merge({}, this._routeParams, defaults)
  }
}
