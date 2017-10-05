import fetchPonyfill from 'fetch-ponyfill'
import UrlPattern from 'url-pattern'

import Scope from './scope'

const { fetch, Request } = fetchPonyfill('XMLHttpRequest')

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
    this.method = opts.method
    this.headers = opts.headers || {}
    this.body = opts.body != null ? opts.body : true
    this.credentials = opts.credentials
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

    const id = opts.id
    const keys = opts.keys
    const body = opts.body
    const headers = Object.assign({}, this.headers, opts.headers)

    const request = new Request(this.__url(id, keys), {
      method: this.method,
      headers: headers,
      credentials: this.credentials,
      body: this.body ? body : null
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
