import _cloneDeep from 'lodash/cloneDeep'
import _concat from 'lodash/concat'
import _defaultsDeep from 'lodash/defaultsDeep'
import _each from 'lodash/each'
import _flow from 'lodash/flow'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isPlainObject from 'lodash/isPlainObject'
import _mapValues from 'lodash/mapValues'
import _merge from 'lodash/merge'
import _set from 'lodash/set'

import Base from './base'
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
  'mutated',
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
    this._routeParams = {}
    this._attributes = {}
    this._reference = {}
    this._changes = new Set()
    this._validators = {}
    this._mutations = this._compiledMutations()
    this._route = this.routes().member
    this.errors = new Errors()

    this._registerActions()
    this._setValidators()

    this.assign(attributes)
    this.boot()
  }

  // interface

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

  mutations () {
    return {}
  }

  // state

  sync () {
    this._reference = _cloneDeep(this._attributes)
    this._changes.clear()
  }

  reset () {
    this._attributes = _cloneDeep(this._reference)
  }

  clear () {
    this._clearAttributes()
    this._clearErrors()
    this._clearState()
  }

  changed () {
    return this._changes.size > 0
  }

  // delegate to resource

  getOption (path, fallback) {
    return this._resource.getOption(path, fallback)
  }

  routes () {
    return this._resource.routes()
  }

  // methods

  get $ () {
    return this._reference
  }

  /**
   * Returns the model's identifier value.
   */
  identifier () {
    return this.get(this.getOption('identifier'))
  }

  /**
   * @param {Object} attributes
   *
   * @returns {Object} The attributes that were assigned to the model.
   */
  assign (attributes) {
    this.set(_defaultsDeep({}, attributes, _cloneDeep(this.defaults())))
    this.sync()
  }

  toJSON () {
    return _mapValues(this._attributes, (value, key) => this.mutated(key, value))
  }

  has (attribute) {
    return this._attributes.hasOwnProperty(attribute)
  }

  mutated (attribute, value) {
    value = value || this.get(attribute)

    const mutator = _get(this._mutations, attribute)

    return mutator
      ? mutator(value)
      : value
  }

  saved (attribute, fallback) {
    return _get(this._reference, attribute, fallback)
  }

  get (attribute, fallback) {
    return _get(this._attributes, attribute, fallback)
  }

  set (attribute, value) {
    if (_isPlainObject(attribute)) {
      return _each(attribute, (value, key) => this.set(key, value))
    }

    const defined = this.has(attribute)

    if (!defined) {
      this._registerAttribute(attribute)
    }

    const previous = this.get(attribute)

    if (this.getOption('mutateOnChange')) {
      value = this.mutated(attribute, value)
    }

    const changed = !_isEqual(previous, value)

    if (previous && !changed) {
      return previous
    }

    _set(this._attributes, attribute, value)

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
      return this._validator(scope).validateProp(this.toJSON(), attribute)
    }

    // IF scope is not default, validate defaults and it.
    return _concat(
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
    return _merge(
      this.validateAll(),
      this._validator(scope).validate(this.toJSON())
    )
  }

  // private

  _getRouteParameters (defaults = {}) {
    return _merge({}, this._attributes, this._routeParams, defaults)
  }

  _compiledMutations () {
    return _mapValues(this.mutations(), (m) => _flow(m))
  }

  _setChange (attribute) {
    if (this.get(attribute) !== this.saved(attribute)) {
      this._changes.add(attribute)
    } else {
      this._changes.delete(attribute)
    }
  }

  _validator (path) {
    return _get(this._validators, path)
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

  _registerAttribute (attribute) {
    // verify is already exists
    if (RESERVED.includes(attribute)) {
      throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
    }

    // create empty error list
    this.errors.set(attribute, [])

    // define getter and setter
    Object.defineProperty(this, attribute, {
      get: () => this.get(attribute),
      set: (value) => this.set(attribute, value)
    })
  }

  _setValidators () {
    const scopes = Object.assign({}, DEFAULT_VALIDATORS, this.validation())

    _each(scopes, (attributes, scope) => {
      this._setValidator(scope, attributes)
    })
  }

  _setValidator (name, attributes) {
    const ruleset = this.getOption('ruleset')

    this._validators[name] = new Validator(ruleset, attributes)
  }
}
