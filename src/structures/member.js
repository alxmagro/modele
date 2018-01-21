import _cloneDeep from 'lodash/cloneDeep'
import _defaultsDeep from 'lodash/defaultsDeep'
import _flow from 'lodash/flow'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isPlainObject from 'lodash/isPlainObject'
import _mapValues from 'lodash/mapValues'
import _set from 'lodash/set'
import Base from './base'
import Validator from '../validation/structures/validator'
import Errors from '../validation/structures/errors'

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
  'valid'
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
    this._mutations = this._compiledMutations()
    this._route = this.routes().member
    this._validator = new Validator(this.getOption('customRules'))
    this._errors = new Errors()

    this._registerActions()
    this._registerRules()

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
    if (this.getOption('mutateBeforeSync')) {
      this.mutate()
    }

    this._reference = _cloneDeep(this._attributes)
    this._changes.clear()
  }

  reset () {
    this._attributes = _cloneDeep(this._reference)
  }

  // reset attributes, errors and state
  clear () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
    this._errors.clear()
    this._changes.clear()
    this._pending = false
  }

  changed () {
    return this._changes.size > 0
  }

  pending () {
    return this._pending
  }

  // delegate to resource

  getOption (path, fallback) {
    return this._resource.getOption(path, fallback)
  }

  routes () {
    return this._resource.routes()
  }

  axios () {
    return this._resource.axios()
  }

  // getters

  get $ () {
    return this._reference
  }

  get errors () {
    return this._errors
  }

  get validator () {
    return this._validator
  }

  // methods

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
      for (const key in attribute) {
        this.set(key, attribute[key])
      }

      return attribute
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

  mutate () {
    this._attributes = this.toJSON()
  }

  valid (options = {}) {
    const attribute = options.attribute
    const scope = options.scope

    if (attribute) {
      const errors = this._validator.validateProp(this.toJSON(), attribute, scope)

      this.errors.set(attribute, errors)
    } else {
      const errors = this._validator.validate(this.toJSON(), scope)

      this.errors.record(errors)
    }

    return !this.errors.any()
  }

  // private

  _getRouteParameters (defaults = {}) {
    return Object.assign({}, this._attributes, this._routeParams, defaults)
  }

  _setChange (attribute) {
    if (this.get(attribute) !== this.saved(attribute)) {
      this._changes.add(attribute)
    } else {
      this._changes.delete(attribute)
    }
  }

  _compiledMutations () {
    return _mapValues(this.mutations(), (m) => _flow(m))
  }

  _registerAttribute (attribute) {
    // verify is already exists
    if (RESERVED.includes(attribute)) {
      throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
    }

    // create empty error list
    this._errors.set(attribute, [])

    // define getter and setter
    Object.defineProperty(this, attribute, {
      get: () => this.get(attribute),
      set: (value) => this.set(attribute, value)
    })
  }

  _registerRules () {
    this._validator.setRules(this.validation())
  }
}
