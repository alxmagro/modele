/* global fetch, Request */

import UrlPattern from 'url-pattern'
import 'isomorphic-fetch'

import Scope from './scope'

const URL_PATTERN_OPTS = {
  segmentNameCharset: 'a-zA-Z0-9_-'
  // segmentNameStartChar: '$'
}

export default class Action {
  /*
    @param {string} baseURL
    @param {string} opts.scope - 'collection', 'member'
    @param {string|boolean} opts.path - Path that are suffixed to URL
    @param {string} opts.method - 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
    @param {string} opts.headers - Object that represent headers
    @param {Object} opts.body - Request body
    @param {Object} opts.credentials - 'omit', 'same-origin', 'include'
  */
  constructor (baseURL, opts = {}) {
    this.baseURL = baseURL || '/'
    this.scope = opts.scope || 'collection'
    this.path = opts.path
    this.method = opts.method || 'GET'
    this.headers = opts.headers || {}
    this.credentials = opts.credentials
  }

  static toQuery (params, prefix) {
    const query = Object.keys(params).map((key) => {
      const value = params[key]

      if (params.constructor === Array) {
        key = `${prefix}[]`
      } else if (params.constructor === Object) {
        key = (prefix ? `${prefix}[${key}]` : key)
      }

      if (typeof value === 'object') {
        return Action.toQuery(value, key)
      } else {
        return `${key}=${encodeURIComponent(value)}`
      }
    })

    return [].concat.apply([], query).join('&')
  }

  /*
    Execute fetch from FetchApi with followed optios
    @param {integer|string} id - Only if scope is 'member'
    @param {Object} body - Request Body
  */
  call (opts = {}) {
    if (Scope.onMember(this.scope) && !opts.id) {
      throw new TypeError('ID is required')
    }

    const config = opts.config || {}
    const headers = Object.assign({}, this.headers, opts.headers)

    let url = this.__url(opts.id, opts.keys)
    let body

    if (this.method === 'GET') {
      if (opts.data) {
        url = url + '?' + Action.toQuery(opts.data)
      }
    } else {
      body = opts.data
    }

    if (config.json) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    const request = new Request(url, {
      method: this.method,
      headers: headers,
      credentials: this.credentials,
      body: body
    })

    return fetch(request)
  }

  // private

  /*
    @param {integer} id
    @param {Object} keys - Object with keys and values that are replaced in URL
    @returns {string} Resolved URL, with ID and Path joined (if presents)
  */
  __url (id, keys = {}) {
    if (Scope.onMember(this.scope) && !id) {
      throw new TypeError('ID is required')
    }

    const pattern = new UrlPattern(this.baseURL, URL_PATTERN_OPTS)
    let url = pattern.stringify(keys)

    if (id) {
      url = url.concat('/' + id)
    }

    if (this.path) {
      url = url.concat('/' + this.path)
    }

    return url
  }
}
