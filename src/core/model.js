import _castArray from 'lodash/castArray'
import _cloneDeep from 'lodash/cloneDeep'
import _defaultsDeep from 'lodash/defaultsDeep'
import _flow from 'lodash/flow'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isPlainObject from 'lodash/isPlainObject'
import _mapValues from 'lodash/mapValues'
import _set from 'lodash/set'
import request from './request'
import Validator from '../validation/validator'

const DEFAULT_OPTIONS = {
  crudMethods: { create: 'post', fetch: 'get', update: 'put', destroy: 'delete' },
  customRules: null,
  identifier: 'id',
  mutateBeforeSave: true,
  mutateBeforeSync: true,
  mutateOnChange: false,
  urlInterpolate: /{([\S]+?)}/g,
  validateMutatedAttributes: true
}

const DEFAULT_ROUTES = {
  resource: null,
  member: '/{$id}'
}

/**
 * Class that represents a Model and Resource
 */
export default class Model {
  /**
   * Create an Model instance
   *
   * @param {Object} attributes
   */
  constructor (attributes = {}) {
    if (!this.constructor._init) {
      throw TypeError('Constructor not initiate, use Model.init() shortly after its creation')
    }

    this._attributes = {}
    this._changes = {}
    this._errors = {}
    this._mutations = _mapValues(this.mutations(), (m) => _flow(m))
    this._pending = false
    this._reference = {}
    this._routeParams = {}
    this._validator = new Validator(
      this.validation(),
      this.getOption('customRules')
    )

    this.assign(attributes)
    this.boot()
  }

  //
  // # STATIC INTERFACES
  //

  /**
   * @Interface that represents axios default config
   *
   * @return {Object}
   */
  static axios () {
    return {}
  }

  /**
   * Function that is called at constructor, use this to avoid overriding the constructor
   */
  static boot () {}

  /**
   * Interface that represents resource options
   *
   * @return {Object}
   */
  static options () {
    return {}
  }

  /**
   * Interface that represents routes. This will be used in request.
   *
   * @return {Object}
   */
  static routes () {
    return {}
  }

  //
  // # STATIC GETTERS
  //

  /**
   * Pending state getter
   *
   * @return {boolean}
   */
  static get pending () {
    return this._pending
  }

  //
  // # STATIC METHODS
  //

  /**
   * Reset internal variables
   */
  static clearState () {
    this._pending = false
    this._routeParams = {}
  }

  /**
   * Send a HTTP Request to create a resource
   *
   * @param  {Object} data
   * @return {Promise}
   */
  static create (data) {
    const config = {
      method: this.getOption('crudMethods').create,
      data: data
    }

    return this.request(config)
  }

  /**
   * Send a HTTP Request to fetch resources
   *
   * @param  {Object} query
   * @return {Promise}
   */
  static fetch (query) {
    const config = {
      method: this.getOption('crudMethods').fetch,
      query: query
    }

    return this.request(config)
  }

  /**
   * Get a option
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Option
   */
  static getOption (path, fallback) {
    return _get(this._options, path, fallback)
  }

  /**
   * Get a route
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {string} an Route defined by static method routes()
   */
  static getRoute (path, fallback) {
    return _get(this._routes, path, fallback)
  }

  /**
   * Function that be called after Class is defined.
   * It sets defaults Class attributes.
   *
   * @return {function} this
   */
  static init () {
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
    this._pending = false
    this._routes = Object.assign({}, DEFAULT_ROUTES, this.routes())
    this._routeParams = {}
    this._init = true

    this.boot()

    return this
  }

  /**
   * Create an Model instance
   *
   * @param  {Object} attributes
   * @return {Object} Model instance
   */
  static new (attributes) {
    return new this(attributes)
  }

  /**
   * @see request
   */
  static request (config, options = { on: 'collection' }) {
    return request(this, config, options)
  }

  /**
   * Set an option
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Option
   */
  static setOption (path, value) {
    return _set(this._options, path, value)
  }

  /**
   * Create an Model instance with given identifier
   *
   * @param  {*} key
   * @return {Object} Model instance
   */
  static stub (key) {
    const identifier = this.getOption('identifier')

    return new this({ [identifier]: key })
  }

  /**
   * Returns route parameters
   *
   * @return {Object}
   */
  static toParam () {
    return Object.assign({}, this._routeParams)
  }

  /**
   * Install plugin
   *
   * @param  {Object} plugin Object that respond to .install()
   * @param  {Object} [options]
   * @return {Object} this
   */
  static use (plugin, options) {
    plugin.install(this, options)

    return this
  }

  /**
   * Assign values to route parameters
   *
   * @return {Object} this
   */
  static where (parameters) {
    Object.assign(this._routeParams, parameters)

    return this
  }

  //
  // # INSTANCE INTERFACES
  //

  /**
   * Function that is called at constructor, use this to avoid overriding the constructor
   */
  boot () {}

  /**
   * Interface that represents default properties of Member
   */
  defaults () {
    return {}
  }

  /**
   * Interface that represents properties mutations
   */
  mutations () {
    return {}
  }

  /**
   * Interface that represents properties validations
   */
  validation () {
    return {}
  }

  //
  // # INSTANCE GETTERS
  //

  /**
   * Saved attributes getter
   *
   * @return {Object} Saved attributes
   */
  get $ () {
    return this._reference
  }

  /**
   * Changed attributes getter
   *
   * @return {Map} Map of attribute changes
   */
  get changes () {
    return this._changes
  }

  /**
   * Errors getter
   *
   * @return {Map} Map of errors
   */
  get errors () {
    return this._errors
  }

  /**
   * Pending state getter
   *
   * @return {boolean}
   */
  get pending () {
    return this._pending
  }

  /**
   * Validator getter
   *
   * @return {Validator}
   */
  get validator () {
    return this._validator
  }

  //
  // # INSTANCE METHODS
  //

  /**
   * Assign given attributes to model attributes and reference. Defaults are considered.
   *
   * @param {Object} attributes
   */
  assign (attributes) {
    this.set(_defaultsDeep({}, attributes, _cloneDeep(this.defaults())))
    this.sync()
  }

  /**
   * Resource axios default configs
   *
   * @return {Object}
   */
  axios () {
    return this.constructor.axios()
  }

  /**
   * Checks for changes in a given attribute, or any of them
   *
   * @param  {string} [attribute]
   * @return {Boolean}
   */
  changed (attribute) {
    if (attribute) {
      return this._changes[attribute]
    }

    return Object.keys(this._changes).some(key => this.changed(key))
  }

  /**
   * Reset attributes, errors, changes and states
   */
  clear () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
    this._errors = _mapValues(this._errors, () => [])
    this._changes = _mapValues(this._changes, () => false)
    this.clearState()
  }

  /**
   * Reset states
   */
  clearState () {
    this._pending = false
    this._routeParams = {}
  }

  /**
   * Send a HTTP Request to create a resource
   *
   * @param  {Object} data
   * @return {Promise}
   */
  create () {
    if (this.getOption('mutateBeforeSave')) {
      this.mutate()
    }

    const config = {
      method: this.getOption('crudMethods').create,
      data: this
    }

    return this.request(config, { on: 'collection' })

      .then(response => {
        if (response) {
          this.assign(response)
        }

        return response
      })
  }

  /**
   * Send a HTTP Request to delete a resource
   *
   * @param  {Object} data
   * @return {Promise}
   */
  destroy () {
    const config = {
      method: this.getOption('crudMethods').destroy
    }

    return this.request(config)
  }

  /**
   * Send a HTTP Request to fetch a resource
   *
   * @param  {Object} query
   * @return {Promise}
   */
  fetch (query) {
    const config = {
      method: this.getOption('crudMethods').fetch,
      query: query
    }

    return this.request(config)

      .then(response => {
        if (response) {
          this.assign(response)
        }

        return response
      })
  }

  /**
   * Returns an attribute's value or a fallback value
   *
   * @param  {string} attribute
   * @param  {*} [fallback]
   * @return {*}
   */
  get (attribute, fallback) {
    return _get(this._attributes, attribute, fallback)
  }

  /**
   * @Resource options
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Resource option
   */
  getOption (path, fallback) {
    return this.constructor.getOption(path, fallback)
  }

  /**
   * Get a Constructor route
   *
   * @see Model.getRoute
   */
  getRoute (path, fallback) {
    return this.constructor.getRoute(path, fallback)
  }

  /**
   * Determines if the model has an attribute
   *
   * @param  {string} attribute
   * @return {Boolean}
   */
  has (attribute) {
    return this._attributes.hasOwnProperty(attribute)
  }

  /**
   * Returns the model's identifier value
   *
   * @return {*}
   */
  identifier () {
    return this.get(this.getOption('identifier'))
  }

  /**
   * Mutates either specific attributes or all attributes if none supplied
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
   * Define the value of an attribute after applying its mutations
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
   * @see request
   */
  request (config, options = { on: 'member' }) {
    return request(this, config, options)
  }

  /**
   * Resets attributes to values the last time the object was sync
   */
  reset () {
    this._attributes = _cloneDeep(this._reference)
  }

  /**
   * Returns an salved attribute's value or a fallback value
   *
   * @param  {string} attribute
   * @param  {*} [fallback]
   * @return {*}
   */
  saved (attribute, fallback) {
    return _get(this._reference, attribute, fallback)
  }

  /**
   * @summary Sets the value of an attribute. If it is not defined, register and create setter and getter.
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
      if (Object.getPrototypeOf(this).hasOwnProperty(attribute)) {
        throw new Error(`Attribute ${attribute} cannot be define: reserved property.`)
      }

      // create empty error list
      this._errors[attribute] = []
      this._changes[attribute] = false

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

    this._changes[attribute] = value !== saved

    return value
  }

  /**
   * Save value of attributes in reference
   */
  sync () {
    if (this.getOption('mutateBeforeSync')) {
      this.mutate()
    }

    this._reference = _cloneDeep(this._attributes)
    this._changes = _mapValues(this._changes, () => false)
  }

  /**
   * A native representation of this model
   *
   * @return {Object}
   */
  toJSON () {
    return this._attributes
  }

  /**
   * A set of this model attributes plus atributes setted with .where()
   *
   * @return {Object}
   */
  toParam () {
    const virtuals = {
      $id: this.identifier()
    }

    return Object.assign({}, this._attributes, this._routeParams, virtuals)
  }

  /**
   * Send a HTTP Request to update a resource
   *
   * @param  {Object} query
   * @return {Promise}
   */
  update (data) {
    if (this.getOption('mutateBeforeSave')) {
      this.mutate()
    }

    const config = {
      method: this.getOption('crudMethods').update,
      data: data || this
    }

    return this.request(config)

      .then(response => {
        if (response) {
          this.assign(response)
        }

        return response
      })
  }

  /**
   * Checks whether there are no errors in a given attribute, or none of them
   *
   * @param  {string} [attribute]
   * @return {Boolean}
   */
  valid (attribute) {
    if (attribute) {
      return !this._errors[attribute] || !this._errors[attribute].length
    }

    return Object.keys(this._errors).every(key => this.valid(key))
  }

  /**
   * Validate all atributes or given attribute
   *
   * @param {Object} options
   * @param {string} [options.attribute]
   * @param {string} [options.scope] Which scope validate (they are defined in validations "on" option)
   * @return {Boolean} validity of the validation
   */
  validate (options = {}) {
    const attribute = options.attribute
    const scope = options.on
    const record = this.getOption('validateMutatedAttributes')
      ? this.mutated()
      : this.toJSON()

    if (attribute) {
      const errors = this._validator.validateProp(record, attribute, scope)

      this._errors[attribute] = errors
    } else {
      const errors = this._validator.validate(record, scope)

      this._errors = errors
    }

    return this.valid(attribute)
  }

  /**
   * Assign values to route parameters
   *
   * @return {Object} this
   */
  where (parameters) {
    Object.assign(this._routeParams, parameters)

    return this
  }
}
