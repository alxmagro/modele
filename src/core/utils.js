import _merge from 'lodash/merge'
import _template from 'lodash/template'

/**
 * Send a request using axios. Designed to be used by Model and their instance
 *
 * @param  {Object} caller Object that call this function
 * @param  {Object} config Axios config
 * @param  {Object} [options]
 * @param  {string} [options.on] Which route ('collection' or 'member')
 * @return {Promise} Axios promise
 */
export function request (caller, config, options = {}) {
  const interpolate = caller.getOption('urlParamPattern')
  const params = caller.toParam()
  const route = caller.getRoute(options.on)

  // set variables pre request
  caller._pending = true
  caller._routeParams = {}

  // merge default config (api) with config
  config = _merge({}, caller.axios(), config)

  // prepend route to url and interpolate url and baseURL
  config.url = _template([route, config.url].join(''), { interpolate })(params)
  config.baseURL = _template(config.baseURL, { interpolate })(params)

  // send request and handle responses
  return caller.getGlobal('axios')(config)

    .then((response) => {
      caller._pending = false

      return response
    })

    .catch((error) => {
      caller._pending = false

      throw error
    })
}

/**
 * Checks if any element in one, is included in two. If so, call callback with
 * first found element as parameter and return it.
 *
 * @param  {Array}    one
 * @param  {Array}    two
 * @param  {Function} callback [description]
 * @return {*} the callback returns
 */
export function includesAny (one, two, callback) {
  one.forEach(elem => {
    if (two.includes(elem)) {
      return callback(elem)
    }
  })
}
