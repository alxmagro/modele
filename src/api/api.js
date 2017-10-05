import _ from 'lodash'
import Action from './action'

const DEFAULT_CONFIG = {
  json: true
}

const DEFAULT_ACTIONS = {
  all: {
    method: 'GET',
    scope: 'collection',
    path: false,
    data: false
  },
  create: {
    method: 'POST',
    scope: 'collection',
    path: false,
    data: true
  },
  read: {
    method: 'GET',
    scope: 'member',
    path: false,
    data: false
  },
  update: {
    method: 'PUT',
    scope: 'member',
    path: false,
    data: true
  },
  delete: {
    method: 'DELETE',
    scope: 'member',
    path: false,
    data: false
  }
}

export default class API {
  /*
    Build a API that represent a set of actions
    @param {string} opts.baseURL - Common baseURL of all actions
    @param {Object} opts.actions.custom - {method, scope, path, data, body, credentials}
    @param {Object} opts.actions.defaults - {all, create, read, update, delete} that value is boolean that enable/disable default actions
  */
  constructor (opts = {}) {
    const baseURL = opts.baseURL || '/'
    const defaultsSetup = _.get(opts, 'actions.defaults', {})
    const customActions = _.get(opts, 'actions.custom', {})

    this.config = _.get(opts, 'config', DEFAULT_CONFIG)
    this.actions = {}

    _.forOwn(DEFAULT_ACTIONS, (opts, name) => {
      if (defaultsSetup[name] !== false) {
        this.actions[name] = new Action(baseURL, opts)
      }
    })

    _.forOwn(customActions, (opts, name) => {
      this.actions[name] = new Action(baseURL, opts)
    })
  }

  static toJSON (body, headers) {
    body = JSON.stringify(body)
    headers = Object.assign({}, headers, {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })

    return { body, headers }
  }
}
