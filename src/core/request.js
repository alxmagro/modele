import _merge from 'lodash/merge'
import _template from 'lodash/template'
import Modele from '../modele'

/**
 * Send a request using axios. Designed to be used by Model and their instance
 *
 * @param  {Object} caller Object that call this function
 * @param  {Object} config Axios config
 * @param  {Object} [options]
 * @param  {string} [options.on] Which route ('collection' or 'member')
 * @return {Promise} Axios promise
 */
export default function request (caller, config, options = {}) {
  const interpolate = caller.getOption('urlInterpolate')
  const params = caller.toParam()
  const route = caller.getRoute(options.on)

  // set variables pre request
  caller._pending = true
  caller._routeParams = {}

  // merge default config (api) with config
  config = _merge({}, caller.axios(), config)

  // prepend route to url and replace variables
  config.url = _template([route, config.url].join(''), { interpolate })(params)

  // send request and handle responses
  return Modele.globals.axios(config)

    .then((response) => {
      caller._pending = false

      return response
    })

    .catch((error) => {
      caller._pending = false

      throw error
    })
}
