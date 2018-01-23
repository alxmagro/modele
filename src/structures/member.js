import _castArray from 'lodash/castArray'
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
    success (response) {
      this.assign(response.data)
    }
  },

  create: {
    route: (routes) => routes.resource,
    config () {
      return {
        method: 'post',
        data: this.toJSON()
      }
    },
    before () {
      if (this.getOption('mutateBeforeSave')) {
        this.mutate()
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
    before () {
      if (this.getOption('mutateBeforeSave')) {
        this.mutate()
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

const RESERVED = [
  'actions',
  'boot',
  'defaults',
  'mutations',
  'validation',
  'changed',
  'clear',
  'reset',
  'sync',
  'axios',
  'getOption',
  'routes',
  'get',
  'has',
  'identifier',
  'mutated',
  'saved',
  'toJSON',
  'valid',
  'assign',
  'mutate',
  'set'
]

export default class Member extends Base {
  constructor (attributes = {}, resource) {
    super()

    this._attributes = {}
    this._changes = new Set()
    this._defaultActions = DEFAULT_ACTIONS
    this._errors = new Errors()
    this._mutations = this._compiledMutations()
    this._pending = false
    this._reference = {}
    this._resource = resource
    this._route = this.routes().member
    this._routeParams = {}
    this._validator = new Validator(this.getOption('customRules'))

    this._registerActions()
    this._registerRules()

    this.assign(attributes)
    this.boot()
  }

  // interface

  actions () {
    return {}
  }

  boot () {}

  defaults () {
    return {}
  }

  mutations () {
    return {}
  }

  validation () {
    return {}
  }

  // state

  changed () {
    return this._changes.size > 0
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

  reset () {
    this._attributes = _cloneDeep(this._reference)
  }

  sync () {
    if (this.getOption('mutateBeforeSync')) {
      this.mutate()
    }

    this._reference = _cloneDeep(this._attributes)
    this._changes.clear()
  }

  // delegate to resource

  axios () {
    return this._resource.axios()
  }

  getOption (path, fallback) {
    return this._resource.getOption(path, fallback)
  }

  routes () {
    return this._resource.routes()
  }

  // getters

  get $ () {
    return this._reference
  }

  get errors () {
    return this._errors
  }

  get pending () {
    return this._pending
  }

  get validator () {
    return this._validator
  }

  // accessor methods

  get (attribute, fallback) {
    return _get(this._attributes, attribute, fallback)
  }

  has (attribute) {
    return this._attributes.hasOwnProperty(attribute)
  }

  /**
   * Returns the model's identifier value.
   */
  identifier () {
    return this.get(this.getOption('identifier'))
  }

  mutated (attribute, value) {
    // return all mutated object
    if (attribute == null) {
      const result = {}

      for (attribute in this._attributes) {
        result[attribute] = this.mutated(attribute)
      }

      return result

    // return given mutated attribute
    } else {
      value = value || this.get(attribute)

      const mutator = _get(this._mutations, attribute)

      return (value != null) && mutator
        ? mutator(value)
        : value
    }
  }

  saved (attribute, fallback) {
    return _get(this._reference, attribute, fallback)
  }

  toJSON () {
    return this._attributes
  }

  valid (options = {}) {
    const attribute = options.attribute
    const scope = options.on
    const record = this.getOption('validateMutatedAttributes')
      ? this.mutated()
      : this.toJSON()

    if (attribute) {
      const errors = this._validator.validateProp(record, attribute, scope)

      this.errors.set(attribute, errors)
    } else {
      const errors = this._validator.validate(record, scope)

      this.errors.record(errors)
    }

    return !this.errors.any()
  }

  // modifier methods

  /**
   * @param {Object} attributes
   *
   * @returns {Object} The attributes that were assigned to the model.
   */
  assign (attributes) {
    this.set(_defaultsDeep({}, attributes, _cloneDeep(this.defaults())))
    this.sync()
  }

  mutate (attribute) {
    // mutate all attributes
    if (attribute == null) {
      for (attribute in this._attributes) {
        this.set(attribute, this.mutated(attribute))
      }

    // mutate specific attribute(s)
    } else {
      _castArray(attribute).forEach(attribute => {
        const current = this.get(attribute)
        const mutated = this.mutated(attribute, current)

        this.set(attribute, mutated)
      })
    }
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

  // private

  _compiledMutations () {
    return _mapValues(this.mutations(), (m) => _flow(m))
  }

  _getRouteParameters (defaults = {}) {
    return Object.assign({}, this._attributes, this._routeParams, defaults)
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

  _setChange (attribute) {
    if (this.get(attribute) !== this.saved(attribute)) {
      this._changes.add(attribute)
    } else {
      this._changes.delete(attribute)
    }
  }
}
