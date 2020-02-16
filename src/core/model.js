import Errors from './errors'

/**
 * Class representing a form object with Resourceful API.
 */
export default class Model {
  /**
   * Create a Model
   *
   * @param {Object} attributes
   */
  constructor (attributes) {
    const validations = this.constructor.validation()

    Object.assign(this, attributes)

    // private properties that should be ignored at toJSON
    this.$errors = new Errors(Object.keys(validations))
    this.$pending = false
    this.$rules = validations
  }

  // REGION Interfaces

  /**
   * Retuns a set of custom options.
   *
   */
  static setup () {
    return {}
  }

  /**
   * Returns an object mapping property names to their mutator functions.
   *
   */
  static mutations () {
    return {}
  }

  /**
   * Should be overridden to implement server request and should return an
   * Promise. Use `fetch` or `axios`, for example.
   *
   */
  static request (config) {
    throw new Error('You must declare static request(config) method.')
  }

  /**
   * Returns an object mapping property names to their validations (Array).
   *
   */
  static validation () {
    return {}
  }

  // REGION Static Methods

  /**
   * Retuns a set of model default options, merged with custom options
   * defined at `static setup()`.
   *
   */
  static options () {
    const defaults = {
      baseURL: '[/:id]',
      verbs: {
        get: 'get',
        create: 'post',
        update: 'put',
        delete: 'delete'
      }
    }

    return { ...defaults, ...this.setup() }
  }

  /**
   * Returns the url with replaced variables and appended parameters.
   *
   * @param {Object} [parameters]
   * @param {Object} [variables]
   * @return {String}
   */
  static url (parameters, variables = {}) {
    const { baseURL } = this.options()
    const query = this.toQuery(parameters)

    return baseURL
      .replace(/\[\/:(\w+)\]/g, (_, group) => {
        return variables[group] ? ('/' + variables[group]) : ''
      })
      .replace(/:(\w+)/g, (match, group) => {
        return variables[group] || match
      })
      .concat(query && query.length ? ('?' + query) : '')
  }

  /**
   * Retuns a string representing URL Parameters of given params.
   *
   * @param {Object} parameters
   * @return {String}
   */
  static toQuery (parameters) {
    return parameters && new URLSearchParams(parameters).toString()
  }

  /**
   * Call `request` to fetch resources.
   *
   * @param {Object} [parameters]
   * @param {Object} [variables]
   * @return {Promise}
   */
  static get (parameters, variables) {
    const { verbs } = this.options()

    return this.request({
      method: verbs.get,
      url: this.url(parameters, variables)
    })
  }

  /**
   * Call `request` to post a resource.
   *
   * @param {Object} data
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static create (data, variables) {
    const { verbs } = this.options()

    return this.request({
      method: verbs.create,
      url: this.url({}, variables),
      data: data
    })
  }

  /**
   * Call `request` to post a resource.
   *
   * @param {Object} data
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static update (data, variables) {
    const { verbs } = this.options()

    return this.request({
      method: verbs.update,
      url: this.url({}, variables),
      data: data
    })
  }

  /**
   * Call `request` to delete a resource.
   *
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static delete (variables) {
    const { verbs } = this.options()

    return this.request({
      method: verbs.delete,
      url: this.url({}, variables)
    })
  }

  // REGION Instance Methods

  /**
   * Validate each property based on tests specified at `Model.validation`.
   *
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validate () {
    return Object.keys(this.$errors.items)
      .map(prop => this.$validateProp(prop))
      .every(validation => validation)
  }

  /**
   * Validate a property based on tests specified at `Model.validation`.
   *
   * @param {string} attribute
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validateProp (prop) {
    const rules = this.$rules[prop] || []
    const json = this.toJSON()

    this.$errors.set(
      prop,
      rules
        .filter(rule => {
          return (
            // Rule conditional
            (!rule.condition || rule.condition(this)) &&

            // Rule test
            !rule.test(json[prop], json, prop)
          )
        })
        .map(({ name, data }) => ({
          name,
          data,
          json,
          prop,
          origin: 'client'
        }))
    )

    return this.$errors.empty(prop)
  }

  /**
   * Sets the "pending" status to `true` until promise is completed.
   *
   * @param {Promise} promise
   */
  $wait (promise) {
    this.$pending = true

    return promise
      .then(result => {
        this.$pending = false

        return result
      })
      .catch(error => {
        this.$pending = false

        throw error
      })
  }

  /**
   * Returns a plain object with mutated properties.
   *
   * @return {Object}
   */
  toJSON () {
    const mutations = this.constructor.mutations()
    const record = {}

    Object
      .keys(this)
      .filter(prop => !prop.startsWith('$'))
      .forEach((prop) => {
        const value = this[prop]

        record[prop] = mutations[prop] ? mutations[prop](value) : value
      })

    return record
  }
}
