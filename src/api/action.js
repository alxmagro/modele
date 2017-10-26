/* global fetch */

import 'isomorphic-fetch'
import _ from 'lodash'

import URL from './url'
import Scope from './scope'

export default class Action {
  constructor (opts = {}) {
    this.scope = 'collection'
    this.baseURL = null
    this.url = null
    this.transform = {}

    // Request
    this.request = {}
    this.request.method = 'GET'
    this.request.headers = {}
    this.request.body = null
    this.request.mode = null
    this.request.credentials = null
    this.request.cache = null
    this.request.redirect = null
    this.request.referrer = null
    this.request.integrity = null

    _.merge(this, opts)
  }

  solvedURL (id, keys = {}) {
    if (Scope.onMember(this.scope) && !id) {
      throw new TypeError('ID is required')
    }

    return (new URL(this.baseURL, id, this.url)).solve(keys)
  }

  call (opts = {}) {
    const id = opts.id
    const keys = opts.keys
    const request = opts.request

    const config = _.merge({}, this, { request })
    const url = this.solvedURL(id, keys)

    for (const key in this.transform) {
      if (this.transform[key]) this.transform[key](config)
    }

    return fetch(url, config.request)
  }
}
