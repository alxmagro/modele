import _ from 'lodash'
import axios from 'axios'

export default class Base {
  constructor () {
    this._pending = false
    this._registerActions()
  }

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
      return this.send(
        config,
        options.before,
        options.success,
        options.failure
      )
    }
  }

  send (config, onRequest, onSuccess, onFailure) {
    return new Promise((resolve, reject) => {
      this._setPending(true)

      // call before callback
      onRequest && onRequest.call(this)

      // merge default config (api) with config
      config = _.merge({}, this._actionConfigs(), config)

      // prepare
      this._prepareRequest(config)

      // send
      return axios(config)

        // success
        .then((response) => {
          this._setPending(false)
          if (onSuccess) onSuccess.call(this, response)
          return resolve(response)
        })

        // failure
        .catch((error) => {
          this._setPending(false)
          if (onFailure) onFailure.call(this, error)
          return reject(error)
        })

        // failure fallback
        .catch((fatal) => {
          return reject(fatal)
        })
    })
  }

  // states

  pending () {
    return this._pending
  }

  // abstract

  _defaultActions () {}
  _actionConfigs () {}
  _prepareRequest (config) {}

  // private

  _setPending (value) {
    this._pending = value
  }

  _registerActions () {
    const actions = Object.assign({}, this._defaultActions(), this.actions())

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
