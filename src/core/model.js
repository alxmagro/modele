import _castArray from 'lodash/castArray'
import _cloneDeep from 'lodash/cloneDeep'
import _defaultsDeep from 'lodash/defaultsDeep'
import _flow from 'lodash/flow'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isPlainObject from 'lodash/isPlainObject'
import _mapValues from 'lodash/mapValues'
import _set from 'lodash/set'
import { request, includesAny } from './utils'
import Modele from '../'
import Validator from './validator'
import ruleset from './ruleset'

const DEFAULT_OPTIONS = {
  identifier: 'id',
  mutateBeforeSave: true,
  mutateBeforeSync: true,
  mutateOnChange: false,
  rulesetAddition: null,
  urlParamPattern: /{([\S]+?)}/g,
  urlParams: {}
}

const DEFAULT_ROUTES = {
  resource: null,
  member: '/{$id}'
}

const RESERVED = {
  class: [
    'getGlobal',
    'getOption',
    'getRoute',
    'init',
    'request',
    'setOption',
    'stub',
    'toParam',
    'use'
  ],

  instance: [
    'assign',
    'axios',
    'changed',
    'clear',
    'get',
    'getGlobal',
    'getOption',
    'getRoute',
    'has',
    'identifier',
    'mutate',
    'mutated',
    'request',
    'reset',
    'saved',
    'set',
    'setOption',
    'sync',
    'toJSON',
    'toParam',
    'valid',
    'validate'
  ]
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
  constructor (attributes = {}, options = {}) {
    if (!this.constructor._init) {
      throw TypeError('Constructor not initiate, use Model.init() shortly after its creation')
    }

    this._attributes = {}
    this._changes = {}
    this._errors = {}
    this._mutations = _mapValues(this.mutations(), (m) => _flow(m))
    this._options = options
    this._pending = false
    this._reference = {}
    this._validator = new Validator(this.constructor._ruleset, this.validation())

    this.assign(attributes)
    this.boot()
  }

  //
  // # STATIC INTERFACES
  //

  /**
   * Every time you make a request, this method is call to set the defaults request configuration.
   * See axios Request Config, to know the accepted keys.
   *
   * @return {Object}
   */
  static axios () {
    return {}
  }

  /**
   * Function that is called at constructor, use this to avoid overriding the constructor
   *
   * @ignore
   */
  static boot () {}

  /**
   * This method is called on init, to set model options. Class and their instances can access them via getOption.
   *
   * @return {Object}
   */
  static options () {
    return {}
  }

  /**
   * Every time you make a class request, **collection** route is prepend to url.
   * In the same way, every instance request prepend **member** route to url.
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
   * State that represents whether the class is waiting for the response of a request, or is idle.
   * Use this to, for example, reveal a spinner, or disable a button.
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
   * Send a `POST` request to collection route URL.
   *
   * @param  {Object} data
   * @return {Promise}
   */
  static create (data) {
    const config = {
      method: 'post',
      data: data
    }

    return this.request(config)
  }

  /**
   * Send a `GET` request to collection route URL.
   *
   * @param  {Object} query
   * @return {Promise}
   */
  static fetch (query) {
    const config = {
      method: 'get',
      query: query
    }

    return this.request(config)
  }

  /**
   * Get a global value defined by `Modele.globals`.
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} the global value
   */
  static getGlobal (path, fallback) {
    return _get(this._globals, path, fallback)
  }

  /**
   * Get a model option defined by `static options`.
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} the option value
   */
  static getOption (path, fallback) {
    return _get(this._options, path, fallback)
  }

  /**
   * Get a model option defined by `static routes`.
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {string} the route value
   */
  static getRoute (path, fallback) {
    return _get(this._routes, path, fallback)
  }

  /**
   * Function that be called after Class is defined.
   * It sets to Class, the options, routes, ruleset,
   * and checks if the class is trying to overwrite some reserved property.
   *
   * @return {function} the class itself.
   *
   * @example
   * class Foo extends Model { ... }
   *
   * Foo.init()
   */
  static init () {
    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
    this._pending = false
    this._routes = Object.assign({}, DEFAULT_ROUTES, this.routes())
    this._ruleset = Object.assign({}, ruleset, this.getOption('rulesetAddition'))
    this._globals = Modele.globals

    this.boot()

    includesAny(Object.getOwnPropertyNames(this), RESERVED.class, (prop) => {
      throw new Error(`Model Error: Static property "${prop}" is reserved.`)
    })

    includesAny(Object.getOwnPropertyNames(this.prototype), RESERVED.instance, (prop) => {
      throw new Error(`Model Error: Property "${prop}" is reserved.`)
    })

    this._init = true

    return this
  }

  /**
   * Send a request using axios, the first argument refer to
   * axios [request config](https://github.com/axios/axios#request-config),
   * and use `options.on` to choose the route that will prefix the `url`.
   *
   * @return {Promise} a Promise
   */
  static request (config, options = { on: 'collection' }) {
    return request(this, config, options)
  }

  /**
   * Set a model option
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} the option
   */
  static setOption (path, value) {
    return _set(this._options, path, value)
  }

  /**
   * Helper constructor that create an instance with given identifier.
   *
   * @param  {*} key
   * @param  {Object} [options]
   * @return {Object} an instance.
   */
  static stub (key, options) {
    const identifier = this.getOption('identifier')

    return new this({ [identifier]: key }, options)
  }

  /**
   * URL interpolated parameters (Option.urlParams)
   *
   * @return {Object}
   * @ignore
   */
  static toParam () {
    return this.getOption('urlParams')
  }

  /**
   * Call the `plugin.install` function, passing this class, and **options** argument.
   * Use this to programatically define methods to Model.
   *
   * @param  {Object} plugin
   * @param  {Object} [options]
   * @return {Object} this
   */
  static use (plugin, options) {
    plugin.install(this, options)

    return this
  }

  //
  // # INSTANCE INTERFACES
  //

  /**
   * Function that is called at constructor, use this to avoid overriding the constructor
   *
   * @ignore
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
   * @ignore
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
   * Set `defaults()` to active and saved attributes, and reset errors, changes and states.
   */
  clear () {
    const defaults = this.defaults()

    this._attributes = defaults
    this._reference = defaults
    this._errors = _mapValues(this._errors, () => [])
    this._changes = _mapValues(this._changes, () => false)
    this._pending = false
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
      method: 'post',
      data: this
    }

    return this.request(config, { on: 'collection' })

      .then(response => {
        response.data
          ? this.assign(response.data)
          : this.sync()

        return response
      })
  }

  /**
   * Send a HTTP Request to delete a resource
   *
   * @param  {Object} data
   * @return {Promise}
   */
  destroy (data) {
    const config = {
      method: 'delete',
      data: data
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
      method: 'get',
      query: query
    }

    return this.request(config)

      .then(response => {
        if (response) {
          this.assign(response.data)
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
   * Get a global value defined by `Modele.globals`.
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Global option
   */
  getGlobal (path, fallback) {
    return _get(this.constructor._globals, path, fallback)
  }

  /**
   * Get a instance option defined by constructor,
   * if not set, then fallback to `static getOption(path, fallback)`.
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Resource option
   */
  getOption (path, fallback) {
    return _get(
      this._options,
      path,
      this.constructor.getOption(path, fallback)
    )
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
   * Checks if the instance has an attribute
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
   * Mutates either specific attributes or all attributes if none supplied.
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
   * Return the value of mutated attribute, or all attributes if none is supplied,
   * without changed the active attributes. If `value` is supplied, calc mutation in this value instead.
   *
   * @param  {string} attribute
   * @param  {*} [value]
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
   * Send a request using axios, the first argument refer to axios [request config](https://github.com/axios/axios#request-config),
   * and use `options.on` to choose the route that will prefix the `url`.
   */
  request (config, options = { on: 'member' }) {
    return request(this, config, options)
  }

  /**
   * Undo changes, that is, sets the value of saved attributes in active attributes.
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
   * Sets the value of an attribute. If it is not defined, register and create setter and getter.
   * Accept mass assign, performing it recursively.
   *
   * @param {string} attribute
   * @param {*} value
   *
   * @example
   * model.set('name', 'Luke')
   * model.set({ name: 'Luke', surname: 'Sywalker' })
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
      if (RESERVED.instance.includes(attribute)) {
        throw new Error(`Model Error: Property "${attribute}" is reserved.`)
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
   * Set an instance option.
   *
   * @param  {string} path
   * @param  {string} value
   * @return {*} Option
   */
  setOption (path, value) {
    return _set(this._options, path, value)
  }

  /**
   * Mutate attributes it `mutateBeforeSync` is true, then save value of attributes in reference.
   */
  sync () {
    if (this.getOption('mutateBeforeSync')) {
      this.mutate()
    }

    this._reference = _cloneDeep(this._attributes)
    this._changes = _mapValues(this._changes, () => false)
  }

  /**
   * Returns a native representation of this model
   *
   * @return {Object}
   */
  toJSON () {
    return this._attributes
  }

  /**
   * URL interpolated parameters (Attributes + Option.urlParams + $id)
   *
   * @return {Object}
   * @ignore
   */
  toParam () {
    const params = this.getOption('urlParams')
    const virtuals = { $id: this.identifier() }

    return Object.assign({}, this._attributes, params, virtuals)
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
      method: 'put',
      data: data || this
    }

    return this.request(config)

      .then(response => {
        response.data
          ? this.assign(response.data)
          : this.sync()

        return response
      })
  }

  /**
   * Checks whether there are no errors in a given attribute, or none of them.
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
   * Perform validations rules, then call `valid` and return.
   *
   * @param {Object} options
   * @param {string} [options.attribute]
   * @param {string} [options.scope] Which scope validate (they are defined in validations "on" option)
   * @return {Boolean} validity of the validation
   */
  validate (options = {}) {
    const attribute = options.attribute
    const scope = options.on
    const record = this.mutated()

    if (attribute) {
      const errors = this._validator.validateProp(record, attribute, scope)

      this._errors[attribute] = errors
    } else {
      const errors = this._validator.validate(record, scope)

      this._errors = errors
    }

    return this.valid(attribute)
  }
}
