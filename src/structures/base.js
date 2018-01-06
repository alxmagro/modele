import _ from 'lodash'
import Modele from '../modele'

export default class Base {
  action (options) {
    return (...configs) => {
      // set first config
      if (options.config) configs = _.concat(options.config, configs)

      // merge all other configs
      const config = _.chain(configs)
        .map((config) => {
          return _.isFunction(config) ? config.call(this) : config
        })
        .reduce((acum, config) => {
          return _.merge(acum, config)
        }, {})
        .value()

      // send request
      return this.send(config, options.callbacks)
    }
  }

  send (config, callbacks = {}) {
    return new Promise((resolve, reject) => {
      this._setPending(true)

      // call before callback
      if (callbacks.before) callbacks.before.call(this)

      // merge default config (api) with config
      config = _.merge({}, this._resource.api(), config)

      // prepare
      this._prepareRequest(config)

      // send
      return Modele.adapters.http.send(config)

        // success
        .then((response) => {
          this._setPending(false)
          if (callbacks.success) callbacks.success.call(this, response)
          return resolve(response)
        })

        // failure
        .catch((error) => {
          this._setPending(false)
          if (callbacks.failure) callbacks.failure.call(this, error)
          return reject(error)
        })

        // failure fallback
        .catch((fatal) => {
          this._setPending(false)
          return reject(fatal)
        })
    })
  }

  // states

  pending () {
    return this._pending
  }

  // abstract

  _prepareRequest (config) {}

  // private

  _setPending (value) {
    this._pending = value
  }

  _registerActions () {
    const actions = Object.assign({}, this._defaults.actions, this.actions())

    _.each(actions, (value, attribute) => {
      this._registerAction(attribute, value)
    })
  }

  _registerAction (name, options) {
    if (_.has(this, name)) {
      throw new Error(`Action ${name} cannot be define: Already defined.`)
    }

    Object.defineProperty(this, name, {
      value: this.action(options)
    })
  }
}
