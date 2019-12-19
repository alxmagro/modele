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
    const validationKeys = Object.keys(this.constructor.validation())
    const config = this.constructor.options()

    Object.assign(this, attributes)

    // non-enumerable properties
    Object.defineProperty(this, '$config', { value: config })
    Object.defineProperty(this, '$errors', { value: new Errors(validationKeys) })
    Object.defineProperty(this, '$pending', { value: false })
  }

  // REGION Interfaces

  /**
   * Retuns a set of model options.
   *
   * @ignore
   */
  static options () {
    return {
      baseURL: '/',
      identifier: 'id',
      isSingular: false,
      httpMethods: {
        fetch: 'get',
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
   * Returns a URL for resources or single resource if id is given, replacing
   * URL variables.
   *
   * @param {*} [id]
   * @param {Object} [variables] - Values of baseURL variables.
   * @return {String}
   */
  static url (id = null, variables = {}) {
    const { baseURL, isSingular } = this.options()
    const url = baseURL.replace(/:(\w+)/g, (_, group) => variables[group])

    return (!id || isSingular) ? url : [url, id].join('/')
  }

  /**
   * Retuns a string representing URL Parameters of given params.
   *
   * @param {Object} [params]
   * @return {String}
   */
  static toQuery (params = {}) {
    return qs.stringify(params, { encode: 'false' })
  }

  /**
   * Call `request` to fetch resources.
   *
   * @param {Object} [params] - URL Parameters.
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static get (params = {}, variables = {}) {
    const { httpMethods } = this.options()

    const url = this.url(null, variables)
    const query = this.toQuery(params)

    return this.request({
      method: httpMethods.fetch,
      url: [url, query].filter(Boolean).join('?')
    })
  }

  /**
   * Call `request` to fetch single resources.
   *
   * @param {*} id
   * @param {Object} [params] - URL Parameters.
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static find (id, params, variables = {}) {
    const { httpMethods } = this.options()

    const url = this.url(id, variables)
    const query = this.toQuery(params)

    return this.request({
      method: httpMethods.fetch,
      url: [url, query].filter(Boolean).join('?')
    })
  }

  /**
   * Call `request` to post a resource.
   *
   * @param {Object} data
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static create (data, variables = {}) {
    const { httpMethods } = this.options()

    return this.request({
      method: httpMethods.create,
      url: this.url(null, variables),
      data: data
    })
  }

  /**
   * Call `request` to post a resource.
   *
   * @param {*} id
   * @param {Object} data
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static update (id, data, variables = {}) {
    const { httpMethods } = this.options()

    return this.request({
      method: httpMethods.update,
      url: this.url(id, variables),
      data: data
    })
  }

  /**
   * Call `request` to delete a resource.
   *
   * @param {*} id
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  static delete (id, variables) {
    const { httpMethods } = this.options()

    return this.request({
      method: httpMethods.delete,
      url: this.url(id, variables)
    })
  }

  // REGION Instance Methods

  /**
   * Helper method that returns identifier value.
   *
   * @return {*} - Value of identifier.
   */
  $id () {
    const { identifier } = this.constructor.options()

    return this[identifier]
  }

  /**
   * Call `request` to create or update this resource, call validation and set
   * pending status properly.
   *
   * @param {boolean} validate - Call validation or not.
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  $save (validate = true, variables = {}) {
    const id = this.$id()

    if (validate && this.$validate(id ? 'update' : 'create')) {
      return Promise.reject(new ValidationError(this))
    }

    return this.$wait(
      id
        ? this.constructor.update(id, this, variables)
        : this.constructor.create(this, variables)
    )
      .then(response => {
        return Object.assign(this, response.data)
      })
  }

  /**
   * Call `request` to delete this resource.
   *
   * @param {Object} [variables] - URL variables.
   * @return {Promise}
   */
  $delete (variables = {}) {
    return this.$wait(
      this.constructor.delete(this.$id(), variables)
    )
  }

  /**
   * Validate each property based on tests specified at `Model.validation`.
   *
   * @param {string} [scope]
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validate (scope = null) {
    return Object.keys(this.$errors.items)
      .map(prop => this.$validateAttribute(prop, scope))
      .every(validation => validation)
  }

  /**
   * Validate a property based on tests specified at `Model.validation`.
   *
   * @param {string} attribute
   * @param {string} [scope]
   * @return {Boolean} Retuns true if has no errors, otherwise false.
   */
  $validateProperty(prop, scope = null) {
    const rules = this.constructor.validation()
    const record = this.toJSON()

    this.$errors.set(
      prop,
      rules
        .filter(({ test, options }) => {
          return (
            // Rule conditional
            !options.if || options.if() &&

            // Rule scope
            !options.on || options.on === scope &&

            // Rule test
            test(record[prop], record, prop)
          )
        })
        .map(({ name, options }) => {
          return { name, record, prop, options, origin: 'client' }
        })
     )

      return this.$errors.any(prop)
   }

  /**
   * Sets the "pending" status to `true` until promise is completed.
   *
   * @param {Promise} promise
   */
  $wait(promise) {
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
