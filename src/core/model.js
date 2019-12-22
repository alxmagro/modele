import Errors from './errors'
import ValidationError from './validation-error'

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
    Object.assign(this, attributes)

    // non-enumerable properties
    Object.defineProperty(this, '$errors', {
      value: new Errors(Object.keys(this.constructor.validation()))
    })

    Object.defineProperty(this, '$pending', {
      value: false,
      writable: true
    })
  }

  // REGION Interfaces

  /**
   * Retuns a set of model options.
   *
   * @ignore
   */
  static options () {
    return {
      baseURL: '[/:id]',
      verbs: {
        get: 'get',
        create: 'post',
        update: 'put',
        delete: 'delete'
      }
    }
  }

  /**
   * Returns a set of property mutations, where keys are property names,
   * and value is a function that changes this property value.
   */
  static mutations () {
    return {}
  }

  /**
   * Should be overridden to implement server request and should return an
   * Promise. Use `fetch` or `axios`, for example.
   */
  static request (config) {
    throw new Error('You must declare static request(config) method.')
  }

  /**
   * Retuns a set of property validations, where keys are property names,
   * and value is an array of objects with name:string, test:function,
   * [on]:string, [:if]:function, [nullable]:boolean.
   */
  static validation () {
    return {}
  }

  // REGION Static Methods

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
   * @param {string} [scope]
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validate (scope) {
    return Object.keys(this.$errors.items)
      .map(prop => this.$validateProperty(prop, scope))
      .every(validation => validation)
  }

  /**
   * Validate a property based on tests specified at `Model.validation`.
   *
   * @param {string} attribute
   * @param {string} [scope]
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validateProperty (prop, scope) {
    const rules = this.constructor.validation()[prop] || []
    const record = this.toJSON()

    this.$errors.set(
      prop,
      rules
        .filter(({ test, options = {} }) => {
          return (
            // Rule conditional
            (!options.if || options.if(this)) &&

            // Rule scope
            (!options.on || options.on === scope) &&

            // Rule test
            !test(record[prop], record, prop)
          )
        })
        .map(({ name, options }) => {
          return { name, record, prop, options, origin: 'client' }
        })
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

    for (const prop in this) {
      const value = this[prop]

      record[prop] = mutations[prop] ? mutations[prop](value) : value
    }

    return record
  }
}
