import _merge from 'lodash/merge'
import Modele from '../modele'

export default class Base {
  send (options = {}) {
    return new Promise((resolve, reject) => {
      this._setPending(true)

      // call before callback
      if (options.before) options.before.call(this)

      // merge default config (api) with config
      const config = _merge({}, this.axios(), options.config)

      // set URL
      config.url = this._getURL(this._route, this._getRouteParameters({
        [this.getOption('routeParameterURL')]: config.url
      }))

      // send
      return Modele.globals.axios(config)

        // success
        .then((response) => {
          this._setPending(false)
          if (options.success) options.success.call(this, response)
          return resolve(response)
        })

        // failure
        .catch((error) => {
          this._setPending(false)
          if (options.failure) options.failure.call(this, error)
          return reject(error)
        })

        // failure fallback
        .catch((fatal) => {
          this._setPending(false)
          return reject(fatal)
        })
    })
  }

  // private

  _getRouteReplacements (route, parameters = {}) {
    const pattern = new RegExp(this.getOption('routeParameterPattern'), 'g')
    const replace = {}
    let parameter

    while ((parameter = pattern.exec(route)) !== null) {
      replace[parameter[0]] = parameters[parameter[1]]
    }

    return replace
  }

  _getURL (route, parameters = {}) {
    const replacements = this._getRouteReplacements(route, parameters)

    // Replace all {variable} in routes to your values
    return Object.keys(replacements).reduce((result, parameter) => {
      const value = replacements[parameter] || ''

      return result.replace(parameter, value)
    }, route)
  }

  _registerAction (name, options) {
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
        config: _merge({}, actionConfig, callConfig),
        before: options.before,
        success: options.success,
        failure: options.failure
      })
    }

    // register
    Object.defineProperty(this, name, { value })
  }

  _registerActions () {
    const actions = Object.assign({}, this._defaults.actions, this.actions())

    for (const attribute in actions) {
      this._registerAction(attribute, actions[attribute])
    }
  }

  _setPending (value) {
    this._pending = value
  }
}
