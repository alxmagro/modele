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
import Map from '../utils/map'

/**
 * @summary Default Member actions
 * @type Object
 * @constant
 * @private
 */
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

/**
 * @summary List of methods that can not be overridden
 * @type Array
 * @constant
 * @private
 */
const RESERVED = [
  'actions',
  'boot',
  'defaults',
  'mutations',
  'validation',
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

  /**
   * @summary Create an instance of Member
   * @name Member
   * @class
   * @public
   *
   * @param {Object} attributes
   * @param {Resource} resource
   * @returns {Member} Member instance
   */
  constructor (attributes = {}, resource) {
    super()

    const actions = Object.assign({}, DEFAULT_ACTIONS, this.actions())

    this._attributes = {}
    this._changes = new Map(false)
    this._errors = new Map([])
    this._mutations = _mapValues(this.mutations(), (m) => _flow(m))
    this._pending = false
    this._reference = {}
    this._resource = resource
    this._route = this.routes().member
    this._routeParams = {}
    this._validator = new Validator(
      this.validation(),
      this.getOption('customRules')
    )

    // set actions
    for (const prop in actions) {
      this.setAction(prop, actions[prop])
    }

    this.assign(attributes)
    this.boot()
  }

  // interface (can be override)

  /**
   * @summary Interface that represents model actions
   * @function
   * @public
   *
   * @return {Object} Dictionary of actions
   */
  actions () {
    return {}
  }

  /**
   * @summary Function that is called at constructor, use this to avoid overriding the constructor
   * @function
   * @public
   */
  boot () {}

  /**
   * @summary Interface that represents default properties of Member
   * @function
   * @public
   *
   * @return {Object}
   */
  defaults () {
    return {}
  }

  /**
   * @summary Interface that represents properties mutations
   * @function
   * @public
   *
   * @return {Object.<string, function|function[]>}
   */
  mutations () {
    return {}
  }

  /**
   * @summary Interface that represents properties validations
   * @function
   * @public
   *
   * @return {Object.<string, Object>}
   */
  validation () {
    return {}
  }

  // state

  /**
   * @summary Reset attributes, errors, changes and states
   * @function
   * @public
   */
  clear () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
    this._errors.clear()
    this._changes.clear()
    this._pending = false
    this._routeParams = {}
  }

  /**
   * @summary Resets attributes to values the last time the object was sync
   * @function
   * @public
   */
  reset () {
    this._attributes = _cloneDeep(this._reference)
  }

  /**
   * @summary Save value of attributes in reference
   * @function
   * @public
   */
  sync () {
    if (this.getOption('mutateBeforeSync')) {
      this.mutate()
    }

    this._reference = _cloneDeep(this._attributes)
    this._changes.clear()
  }

  // delegate to resource

  /**
   * @summary Resource axios default configs
   * @function
   * @public
   *
   * @return {Object}
   */
  axios () {
    return this._resource.axios()
  }

  /**
   * @summary Resource options
   * @function
   * @public
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Resource option
   */
  getOption (path, fallback) {
    return this._resource.getOption(path, fallback)
  }

  /**
   * @summary Resource routes
   * @function
   * @public
   *
   * @return {Object.<string, string>}
   */
  routes () {
    return this._resource.routes()
  }

  // getters

  /**
   * @summary Saved attributes getter
   * @function
   * @public
   *
   * @return {Object} Saved attributes
   */
  get $ () {
    return this._reference
  }

  /**
   * @summary Changed attributes getter
   * @function
   * @public
   *
   * @return {Map} Map of attribute changes
   */
  get changes () {
    return this._changes
  }

  /**
   * @summary Errors getter
   * @function
   * @public
   *
   * @return {Map} Map of errors
   */
  get errors () {
    return this._errors
  }

  /**
   * @summary Pending state getter
   * @function
   * @public
   *
   * @return {boolean}
   */
  get pending () {
    return this._pending
  }

  /**
   * @summary Validator getter
   * @function
   * @public
   *
   * @return {Validator}
   */
  get validator () {
    return this._validator
  }

  // accessor methods

  /**
   * @summary Returns an attribute's value or a fallback value
   * @function
   * @public
   *
   * @param  {string} attribute
   * @param  {*} [fallback]
   * @return {*}
   */
  get (attribute, fallback) {
    return _get(this._attributes, attribute, fallback)
  }

  /**
   * @summary Determines if the model has an attribute
   * @function
   * @public
   *
   * @param  {string} attribute
   * @return {Boolean}
   */
  has (attribute) {
    return this._attributes.hasOwnProperty(attribute)
  }

  /**
   * @summary Returns the model's identifier value
   * @function
   * @public
   *
   * @return {*}
   */
  identifier () {
    return this.get(this.getOption('identifier'))
  }

  /**
   * @summary Define the value of an attribute after applying its mutations
   * @function
   * @public
   *
   * @param  {string} attribute
   * @param  {*} [value] Value can be supplied instead of self attribute value
   * @return {*}
   */
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

  /**
   * @summary Returns an salved attribute's value or a fallback value
   * @function
   * @public
   *
   * @param  {string} attribute
   * @param  {*} [fallback]
   * @return {*}
   */
  saved (attribute, fallback) {
    return _get(this._reference, attribute, fallback)
  }

  /**
   * @summary A native representation of this model
   * @function
   * @public
   *
   * @return {Object}
   */
  toJSON () {
    return this._attributes
  }

  /**
   * @summary A set of this model attributes plus atributes setted with .where()
   * @function
   * @public
   *
   * @return {Object}
   */
  toParam () {
    return Object.assign({}, this._attributes, this._routeParams)
  }

  /**
   * @summary Validate all atributes or given attribute
   * @function
   * @public
   *
   * @param {Object} options
   * @param {string} [options.attribute]
   * @param {string} [options.scope] Which scope validate (they are defined in validations "on" option)
   * @return {*}
   */
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
   * @summary Assign given attributes to model attributes and reference. Defaults are considered.
   * @function
   * @public
   *
   * @param  {Object} attributes
   */
  assign (attributes) {
    this.set(_defaultsDeep({}, attributes, _cloneDeep(this.defaults())))
    this.sync()
  }

  /**
   * @summary Mutates either specific attributes or all attributes if none supplied
   * @function
   * @public
   *
   * @param  {string} [attribute]
   */
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

  /**
   * @summary Sets the value of an attribute. If it is not defined, register and create setter and getter.
   * @function
   * @public
   *
   * @param {string} attribute
   * @param {*} value
   */
  set (attribute, value) {
    if (_isPlainObject(attribute)) {
      for (const key in attribute) {
        this.set(key, attribute[key])
      }

      return attribute
    }

    const defined = this.has(attribute)

    // register attribute is not already defined
    if (!defined) {

      // verify is already exists
      if (RESERVED.includes(attribute)) {
        throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
      }

      // create empty error list
      this._errors.set(attribute, [])
      this._changes.set(attribute, false)

      // define getter and setter
      Object.defineProperty(this, attribute, {
        get: () => this.get(attribute),
        set: (value) => this.set(attribute, value)
      })
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

    const saved = this.saved(attribute)

    this._changes.set(attribute, value !== saved)

    return value
  }
}
