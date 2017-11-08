import _ from 'lodash'
import axios from 'axios'
import URL from './http/url'
import { Validator, Errors } from './validation'

const RESERVED = [
  // TODO
]

const DEFAULT_VALIDATORS = {
  defaults: {}
}

const DEFAULT_OPTIONS = {
  identifier: 'id',
  ruleset: null
}

const DEFAULT_ACTIONS = {
  fetch: {
    config: {},
    success (response) {
      this.assign(response.data)
    }
  },

  create: {
    config () {
      return {
        method: 'post',
        data: this.toJSON()
      }
    },

    success (response) {
      if (response) {
        this.assign(response.data)
      }
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
    this._validators = {}
    this.errors = new Errors()

    this.setOptions()
    this.setValidators()
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

  validation () {

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

  get $ () {
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

  setChange (attribute) {
    if (this.get(attribute) !== this.saved(attribute)) {
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

  clear () {
    this.clearAttributes()
    this.clearErrors()
    this.clearState()
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
      onRequest && onRequest.call(this)

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

  getValidator (path) {
    return _.get(this._validators, path)
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

    const previous = this.get(attribute)

    if (this.getOption('mutateOnChange')) {
      value = this.mutated(attribute, value)
    }

    const changed = !_.isEqual(previous, value)

    if (previous && !changed) {
      return previous
    }

    _.set(this._attributes, attribute, value)

    this.setChange(attribute)

    return value
  }

  valid (scope = 'defaults', attribute) {
    let errors

    if (attribute) {
      errors = this.validateAttribute(attribute, scope)

      this.errors.set(attribute, errors)
    } else {
      errors = this.validate(scope)

      this.errors.record(errors)
    }

    return !this.errors.any()
  }

  validateAttribute (attribute, scope = 'defaults') {
    const errors = []

    if (scope !== 'defaults') {
      errors.concat(this.validateAttribute(this._attributes, attribute))
    }

    const validator = this.getValidator(scope)

    errors.concat(validator.validateAttribute(this._attributes, attribute))

    return errors
  }

  validate (scope = 'defaults') {
    const errors = {}

    if (scope !== 'defaults') {
      _.merge(errors, this.validate())
    }

    const validator = this.getValidator(scope)

    _.merge(errors, validator.validate(this._attributes))

    return errors
  }

  // REGISTERS

  setOptions () {
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
  }

  setValidators () {
    const scopes = Object.assign({}, DEFAULT_VALIDATORS, this.validation())

    _.each(scopes, (attributes, scope) => {
      this.setValidator(scope, attributes)
    })
  }

  registerActions () {
    const actions = Object.assign({}, DEFAULT_ACTIONS, this.actions())

    _.each(actions, (value, attribute) => {
      this.registerAction(attribute, value)
    })
  }

  setValidator (name, attributes) {
    const ruleset = this.getOption('ruleset')

    this._validators[name] = new Validator(ruleset, attributes)
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
