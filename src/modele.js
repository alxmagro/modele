import _ from 'lodash'
import axios from 'axios'
import URL from './http/url'
import Errors from './validator/errors'

const RESERVED = [
  // TODO
]

const DEFAULT_OPTIONS = {
  identifier: 'id'
}

const DEFAULT_ACTIONS = {
  fetch: {
    config: {},
    success (response) {
      this.assign(response.data)
    }
  },

  update: {
    config () {
      return {
        method: 'put',
        data: this.toJSON()
      }
    },

    success (response) {
      // clear errors
      if (response) {
        this.assign(response.data)
      }
    }
  },

  destroy: {
    config: { method: 'delete' },
    success () {
      this.clear()
    }
  }
}

export default class Modele {
  // CONSTRUCTORS

  constructor (attributes = {}) {
    this._keys = {}
    this._attributes = {}
    this._reference = {}
    this._options = {}
    this._changes = new Set()
    this._pending = false
    this.errors = new Errors()

    this.setOptions()
    this.registerActions()

    this.assign(attributes)
    this.boot()
  }

  static stub (identifier) {
    const stub = new this()
    const key = stub.getOption('identifier')

    stub.set(key, identifier)

    return stub
  }

  // DESTRUCTORS

  clearAttributes () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
  }

  clearErrors () {
    this.errors.clear()
  }

  clearState () {
    this._changes.clear()
    this._pending = false
  }

  // INTERFACE

  boot () {
  }

  options () {
    return {}
  }

  api () {
    return {}
  }

  actions () {
    return {}
  }

  /**
   * @returns {Object} Return default attributes
   */
  defaults () {
    return {}
  }

  // ALIASES

  get $() {
    return this._reference
  }

  // STATES

  pending () {
    return this._pending
  }

  changed () {
    return this._changes.size > 0
  }

  // STATE MUTATIONS

  setChange (attribute, value) {
    if (value) {
      this._changes.add(attribute)
    } else {
      this._changes.delete(attribute)
    }
  }

  setPending (value) {
    this._pending = value
  }

  sync () {
    this._reference = _.cloneDeep(this._attributes)
    this._changes.clear()
  }

  reset () {
    this._attributes = _.cloneDeep(this._reference)
  }

  // REQUESTS

  action (options) {
    return (...configs) => {
      // set first config
      if (options.config) configs = _.concat(options.config, configs)

      // merge all other configs
      const config = _.chain(configs)
        .map((config) => {
          return _.isFunction(config) ? config.call(this) : config
        })
        .reduce((acum, config) => {
          return _.merge(acum, config)
        }, {})
        .value()

      // send request
      return this.send(
        config,
        options.before,
        options.success,
        options.failure
      )
    }
  }

  prepareRequest (config) {
    config.url = URL.new(config.url).solve(this._keys)
    config.baseURL = URL.new(config.baseURL, this.identifier()).solve(this._keys)
  }

  send (config, onRequest, onSuccess, onFailure) {
    return new Promise((resolve, reject) => {
      this.setPending(true)

      // call before callback
      if (onRequest) onRequest.call(this)

      // merge default config (api) with config
      config = _.merge({}, this.api(), config)

      // prepare
      this.prepareRequest(config)

      // send
      return axios(config)

        // success
        .then((response) => {
          this.setPending(false)
          if (onSuccess) onSuccess.call(this, response)
          return resolve(response)
        })

        // failure
        .catch((error) => {
          this.setPending(false)
          if (onFailure) onFailure.call(this, error)
          return reject(error)
        })

        // failure fallback
        .catch((fatal) => {
          return reject(fatal)
        })
    })
  }

  // METHODS

  /**
   * @param {Object} attributes
   *
   * @returns {Object} The attributes that were assigned to the model.
   */
  assign (attributes) {
    this.set(_.defaultsDeep({}, attributes, _.cloneDeep(this.defaults())))
    this.sync()
  }

  clear () {
    this.clearAttributes()
    this.clearErrors()
    this.clearState()
  }

  /**
   * Returns the model's identifier value.
   */
  identifier () {
    return this.get(this.getOption('identifier'))
  }

  getOption (path, fallback) {
    return _.get(this._options, path, fallback)
  }

  setOption (path, value) {
    return _.set(this._options, path, value)
  }

  toJSON () {
    return this._attributes
  }

  has (attribute) {
    return _.has(this._attributes, attribute)
  }

  saved (attribute, fallback) {
    return _.get(this._reference, attribute, fallback)
  }

  get (attribute, fallback) {
    return _.get(this._attributes, attribute, fallback)
  }

  set (attribute, value) {
    if (_.isPlainObject(attribute)) {
      return _.each(attribute, (value, key) => this.set(key, value))
    }

    const defined = this.has(attribute)

    if (!defined) {
      this.registerAttribute(attribute)
    }

    const saved = this.saved(attribute)
    const previous = this.get(attribute)

    if (this.getOption('mutateOnChange')) {
      value = this.mutated(attribute, value)
    }

    const primal = _.isEqual(saved, value)

    this.setChange(attribute, !primal)

    const changed = !_.isEqual(previous, value)

    if (previous && !changed) {
      return previous
    }

    _.set(this._attributes, attribute, value)

    return value
  }

  // REGISTERS

  setOptions () {
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
  }

  registerActions () {
    const actions = Object.assign({}, DEFAULT_ACTIONS, this.actions())

    _.each(actions, (value, attribute) => {
      this.registerAction(attribute, value)
    })
  }

  registerAction (name, options) {
    if (_.has(RESERVED, name)) {
      throw new Error(`Action ${name} cannot be define: reserved property.`)
    }

    Object.defineProperty(this, name, {
      value: this.action(options)
    })
  }

  registerAttribute (attribute) {
    if (_.has(RESERVED, attribute)) {
      throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
    }

    Object.defineProperty(this, attribute, {
      get: () => this.get(attribute),
      set: (value) => this.set(attribute, value)
    })
  }
}