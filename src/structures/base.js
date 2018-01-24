import _merge from 'lodash/merge'
import Modele from '../modele'

/**
 * @callback beforeCallback
 */

/**
 * @callback successCallback
 * @param {Object} response axios successfully response
 */

/**
 * @callback failureCallback
 * @param {Object} error axios failure response
 */

/**
 * @summary Transform parameters object into replacements Object
 * @function
 * @private
 *
 * @param  {string} route
 * @param  {regex} pattern
 * @param  {Object.<{string, *}>} parameters
 * @return {Object.<{string, *}>} Keys and Dictionary of terms ready to replace function
 *
 * @example
 * routeReplacements('foo/{bar}', /\{([^}]+)\}/, { bar: 5 })
 * > { {foo}: 5 }
 */
const routeReplacements = function (route, pattern, parameters = {}) {
  const regex = new RegExp(pattern, 'g')
  const replace = {}
  let parameter

  while ((parameter = regex.exec(route)) !== null) {
    replace[parameter[0]] = parameters[parameter[1]]
  }

  return replace
}

/**
 * @summary Replace all occurences in parameters keys to their values in route string
 * @function
 * @private
 *
 * @param  {string} route
 * @param  {regex} pattern
 * @param  {Object.<{string, *}>} parameters
 * @return {string} Solved string
 *
 * @example
 * getURL('foo/{bar}', /\{([^}]+)\}/, { bar: 5 })
 * > 'foo/5'
 */
const getURL = function (route, pattern, parameters = {}) {
  const replacements = routeReplacements(route, pattern, parameters)

  // Replace all {variable} in routes to your values
  return Object.keys(replacements).reduce((result, parameter) => {
    if (replacements[parameter] == null) {
      throw new TypeError(`Cannot find ${parameter} value to URL: ${route}`)
    }

    return result.replace(parameter, replacements[parameter])
  }, route)
}

export default class Base {
  /**
   * @summary Send a request using axios
   * @function
   * @public
   *
   * @param  {Object} [options={}]
   * @param  {function} [options.route] Receive routes() and return a route
   * @param  {function|Object} [options.config] Axios config or a function that returns it
   * @param  {beforeCallback} [options.before]
   * @param  {successCallback} [options.success]
   * @param  {failureCallback} [options.failure]
   * @return {Promise} the Promise
   *
   * @example
   * Resource.send({
   *   config: { method: 'get' }
   *   success: (response) => console.log(response.data)
   * })
   */
  send (options = {}) {
    return new Promise((resolve, reject) => {
      this._pending = true

      // call before callback
      if (options.before) {
        options.before.call(this)
      }

      // merge default config (api) with config
      const config = _merge({}, this.axios(), options.config)

      // get route
      const route = options.route != null
        ? options.route(this.routes())
        : this._route

      // set URL
      const routeParameterURL = this.getOption('routeParameterURL')
      const routeParameterPattern = this.getOption('routeParameterPattern')

      this.where({ [routeParameterURL]: config.url || '' })

      config['url'] = getURL(route, routeParameterPattern, this.toParam())

      // send
      return Modele.globals.axios(config)

        // success
        .then((response) => {
          this._pending = false
          this._routeParams = {}

          if (options.success) {
            options.success.call(this, response)
          }

          return resolve(response)
        })

        // failure
        .catch((error) => {
          this._pending = false
          this._routeParams = {}

          if (options.failure) {
            options.failure.call(this, error)
          }

          return reject(error)
        })

        // failure fallback
        .catch((fatal) => {
          this._pending = false
          this._routeParams = {}

          return reject(fatal)
        })
    })
  }

  /**
   * @summary Define property with function that call send() function
   * @function
   * @public
   *
   * @param  {string} name Name
   * @param  {Object} options Options
   * @param  {function} [options.route] Receive routes() and return a route
   * @param  {function|Object} [options.config] Axios config or a function that returns it
   * @param  {beforeCallback} [options.before]
   * @param  {successCallback} [options.success]
   * @param  {failureCallback} [options.failure]
   * @return {function} Function that returns a send function
   *
   * @example
   * Resource.setAction('findAll', {
   *   contig: { method: 'get' }
   * })
   */
  setAction (name, options) {
    // verify is it is'nt aready defined
    if (this.hasOwnProperty(name)) {
      throw new Error(`Action ${name} cannot be define: Already defined.`)
    }

    // build action
    const value = (callConfig) => {
      const actionConfig = typeof options.config === 'function'
        ? options.config.call(this)
        : options.config

      // send request
      return this.send({
        route: options.route,
        config: _merge({}, actionConfig, callConfig),
        before: options.before,
        success: options.success,
        failure: options.failure
      })
    }

    // register
    Object.defineProperty(this, name, { value })
  }

  /**
   * @summary Add route parameters to resolve the url when an action is called
   * @function
   * @public
   *
   * @param  {Object} parameters Values to resolve in route url
   * @return {Object} Self object
   *
   * @example
   * Resource.where({ api_version: 2 }).send(...)
   */
  where (parameters) {
    Object.assign(this._routeParams, parameters)

    return this
  }
}
