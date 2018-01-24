import _get from 'lodash/get'
import _set from 'lodash/set'
import Base from './base'

/**
 * @summary Default Resource actions
 * @type Object
 * @constant
 * @private
 */
const DEFAULT_ACTIONS = {
  create: {
    config: { method: 'post' }
  },
  fetch: {}
}

const DEFAULT_OPTIONS = {
  customRules: null,
  identifier: 'id',
  mutateBeforeSave: true,
  mutateBeforeSync: true,
  mutateOnChange: false,
  routeParameterPattern: /\{([^}]+)\}/,
  routeParameterURL: '$url',
  validateMutatedAttributes: true
}

export default class Resource extends Base {

  /**
   * @summary Create an instance of Resource
   * @name Resource
   * @class
   * @public
   *
   * @returns {Resource} Resource instance
   */
  constructor () {
    super()

    this._options = Object.assign({}, DEFAULT_OPTIONS, this.options())
    this._pending = false
    this._route = this.routes().resource
    this._routeParams = {}

    // mount actions
    const actions = Object.assign({}, DEFAULT_ACTIONS, this.actions())

    for (const prop in actions) {
      this.setAction(prop, actions[prop])
    }

    this.boot()
  }

  /**
   * @summary Return a Member instance with given attributes
   * @function
   * @public
   *
   * @param  {Object} attributes
   * @return {Member}
   */
  new (attributes) {
    const Member = this.member()

    return new Member(attributes, this)
  }

  /**
   * @summary Return a Member instance with given identifier
   * @function
   * @public
   *
   * @param  {*} key
   * @return {Member}
   */
  stub (key) {
    const Member = this.member()
    const stub = new Member(null, this)
    const identifier = this.getOption('identifier')

    stub.set(identifier, key)

    return stub
  }

  // interface

  /**
   * @summary Interface that represents resource actions
   * @function
   * @public
   *
   * @return {Object} Dictionary of actions
   */
  actions () {
    return {}
  }

  /**
   * @summary Interface that represents axios default config
   * @function
   * @public
   *
   * @return {Object}
   */
  axios () {
    return {}
  }

  /**
   * @summary Function that is called at constructor, use this to avoid overriding the constructor
   * @function
   * @public
   */
  boot () {}

  /**
   * @summary Must be overriden to return a Member class.
   * @function
   * @abstract
   * @public
   *
   * @return {Member}
   */
  member () {}

  /**
   * @summary Interface that represents resource options
   * @function
   * @public
   *
   * @return {Object}
   */
  options () {
    return {}
  }

  /**
   * @summary Interface that represents routes. This will be used in request.
   * @function
   * @public
   *
   * @return {Object}
   */
  routes () {
    const actionURL = this.getOption('routeParameterURL')
    const identifier = this.getOption('identifier')

    return {
      resource: '{' + actionURL + '}',
      member: '/{' + identifier + '}{' + actionURL + '}'
    }
  }

  // getters

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

  // methods

  /**
   * @summary Get a option
   * @function
   * @public
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Option
   */
  getOption (path, fallback) {
    return _get(this._options, path, fallback)
  }

  /**
   * @summary Set a option
   * @function
   * @public
   *
   * @param  {string} path
   * @param  {string} [fallback]
   * @return {*} Option
   */
  setOption (path, value) {
    return _set(this._options, path, value)
  }

  /**
   * @summary A set of this model attributes plus atributes setted with .where()
   * @function
   * @public
   *
   * @return {Object}
   */
  toParam () {
    return Object.assign({}, this._routeParams)
  }
}
