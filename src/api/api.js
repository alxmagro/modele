import _ from 'lodash'
import Action from './action'

import asJsonTransform from './transform/as-json'
import asQueryTrasform from './transform/as-query'

const DEFAULT_CONFIG = {
  transform: {
    asJson: asJsonTransform,
    asQuery: asQueryTrasform
  }
}

const DEFAULT_ACTIONS = {
  all: {
    scope: 'collection',
    request: {
      method: 'GET'
    }
  },
  create: {
    scope: 'collection',
    request: {
      method: 'POST'
    }
  },
  read: {
    scope: 'member',
    request: {
      method: 'GET'
    }
  },
  update: {
    scope: 'member',
    request: {
      method: 'PUT'
    }
  },
  delete: {
    scope: 'member',
    request: {
      method: 'DELETE'
    }
  }
}

export default class API {
  constructor (opts = {}) {
    const defaults = _.get(opts, 'actions.defaults', {})
    const custom = _.get(opts, 'actions.custom', {})

    this.defaults = _.merge({}, DEFAULT_CONFIG, opts.defaults)
    this.actions = {}

    _.forOwn(DEFAULT_ACTIONS, (opts, name) => {
      if (defaults[name] !== false) {
        this.addAction(name, opts)
      }
    })

    _.forOwn(custom, (opts, name) => {
      this.addAction(name, opts)
    })
  }

  addAction (name, opts) {
    opts = _.merge({}, this.defaults, opts)

    this.actions[name] = new Action(opts)
  }
}
