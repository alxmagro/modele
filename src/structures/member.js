import Base from './base'
import _ from 'lodash'
import URL from '../http/url'
import { Validator, Errors } from '../validation'

const DEFAULT_ACTIONS = {
  fetch: {
    config: {},
    callbacks: {
      success (response) {
        this.assign(response.data)
      }
    }
  },

  create: {
    config () {
      return {
        method: 'post',
        data: this.toJSON()
      }
    },

    callbacks: {
      success (response) {
        if (response) {
          this.assign(response.data)
        }
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

    callbacks: {
      success (response) {
        if (response) {
          this.assign(response.data)
        }
      }
    }
  },

  destroy: {
    config: { method: 'delete' },

    callbacks: {
      success () {
        this.clear()
      }
    }
  }
}

const DEFAULT_VALIDATORS = {
  defaults: {}
}

const RESERVED = [
  'boot',
  'actions',
  'defaults',
  'validation',
  'sync',
  'reset',
  'clear',
  'changed',
  'assign',
  'toJSON',
  'has',
  'saved',
  'get',
  'set',
  'valid',
  'validateAttribute',
  'validateAll'
]

export default class Member extends Base {
  constructor (attributes = {}, resource) {
    super()

    this._pending = false
    this._defaults = { actions: DEFAULT_ACTIONS }
    this._resource = resource
    this._keys = {}
    this._attributes = {}
    this._reference = {}
    this._changes = new Set()
    this._validators = {}
    this.errors = new Errors()

    this._registerActions()
    this._setValidators()

    this.assign(attributes)
    this.boot()
  }

  // interface

  resource () {}
  boot () {}

  actions () {
    return {}
  }

  defaults () {
    return {}
  }

  validation () {
    return {}
  }

  // state

  sync () {
    this._reference = _.cloneDeep(this._attributes)
    this._changes.clear()
  }

  reset () {
    this._attributes = _.cloneDeep(this._reference)
  }

  clear () {
    this._clearAttributes()
    this._clearErrors()
    this._clearState()
  }

  changed () {
    return this._changes.size > 0
  }

  // methods

  get $ () {
    return this._reference
  }

  /**
   * Returns the model's identifier value.
   */
  identifier () {
    return this.get(this._resource.getOption('identifier'))
  }

  /**
   * @param {Object} attributes
   *
   * @returns {Object} The attributes that were assigned to the model.
   */
  assign (attributes) {
    this.set(_.defaultsDeep({}, attributes, _.cloneDeep(this.defaults())))
    this.sync()
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
      this._registerAttribute(attribute)
    }

    const previous = this.get(attribute)

    if (this._resource.getOption('mutateOnChange')) {
      value = this.mutated(attribute, value)
    }

    const changed = !_.isEqual(previous, value)

    if (previous && !changed) {
      return previous
    }

    _.set(this._attributes, attribute, value)

    this._setChange(attribute)

    return value
  }

  valid (options = {}) {
    let errors

    if (options.attribute) {
      errors = this.validateAttribute(options.attribute, options.scope)

      this.errors.set(options.attribute, errors)
    } else {
      errors = this.validateAll(options.scope)

      this.errors.record(errors)
    }

    return !this.errors.any()
  }

  validateAttribute (attribute, scope = 'defaults') {
    // IF scope is default, validate only it.
    if (scope === 'defaults') {
      return this.validator(scope).validateProp(attribute)
    }

    // IF scope is not default, validate defaults and it.
    return _.concat(
      this.validateAttribute(attribute),
      this._validator(scope).validateProp(this.toJSON(), attribute)
    )
  }

  validateAll (scope = 'defaults') {
    // IF scope is default, validate only it.
    if (scope === 'defaults') {
      return this._validator(scope).validate(this.toJSON())
    }

    // IF scope is not default, validate defaults and it.
    return _.merge(
      this.validateAll(),
      this._validator(scope).validate(this.toJSON())
    )
  }

  // private

  _setChange (attribute) {
    if (this.get(attribute) !== this.saved(attribute)) {
      this._changes.add(attribute)
    } else {
      this._changes.delete(attribute)
    }
  }

  _validator (path) {
    return _.get(this._validators, path)
  }

  _clearAttributes () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
  }

  _clearErrors () {
    this.errors.clear()
  }

  _clearState () {
    this._changes.clear()
    this._pending = false
  }

  _prepareRequest (config) {
    config.url = URL.new(config.url).solve(this._keys)
    config.baseURL = URL.new(config.baseURL, this.identifier()).solve(this._keys)
  }

  _registerAttribute (attribute) {
    if (_.has(RESERVED, attribute)) {
      throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
    }

    Object.defineProperty(this, attribute, {
      get: () => this.get(attribute),
      set: (value) => this.set(attribute, value)
    })
  }

  _setValidators () {
    const scopes = Object.assign({}, DEFAULT_VALIDATORS, this.validation())

    _.each(scopes, (attributes, scope) => {
      this._setValidator(scope, attributes)
    })
  }

  _setValidator (name, attributes) {
    const ruleset = this._resource.getOption('ruleset')

    this._validators[name] = new Validator(ruleset, attributes)
  }
}
