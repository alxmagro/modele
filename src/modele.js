import _ from 'lodash'
import Builder from './builder'
import API from './api/api'
import Objet from './objet'
import Scope from './api/scope'
import Validator from './validator/validator'

/*
  A Factory that represents a Resource or a Model from your server-side app,
  that creates Objets instance, that represents Objects from thats Models,
  with attributes, methods, computeds and validadates.
*/
export default class Modele {
  constructor (opts = {}, keys = {}) {
    // basic
    Object.defineProperty(this, '__opts', { value: opts })
    Object.defineProperty(this, '__name', { value: opts.name })
    Object.defineProperty(this, '__keys', { value: keys })

    // api
    if (opts.api === true) {
      Object.defineProperty(this, '__api', { value: new API() })
    } else if (opts.api !== false) {
      Object.defineProperty(this, '__api', { value: new API(opts.api) })
    }

    // actions
    if (this.__api) {
      Builder.defineActions(this, this.__api.actions)
    }

    // data
    const data = _.get(opts, 'static.data', () => ({}))

    Builder.defineData(this, data)

    // computed
    const computed = _.get(opts, 'static.computed', {})

    Builder.defineComputed(this, computed)

    // methods
    const methods = _.get(opts, 'static.methods', {})

    Builder.defineMethods(this, methods)

    // validations
    if (opts.validates) {
      const config = _.get(opts, 'config.validator')

      const onCreateValidator = new Validator(config)
      const onUpdateValidator = new Validator(config)

      Builder.addRulesToValidator(onCreateValidator, opts.validates.onCreate)
      Builder.addRulesToValidator(onCreateValidator, opts.validates.onSave)
      Builder.addRulesToValidator(onUpdateValidator, opts.validates.onUpdate)
      Builder.addRulesToValidator(onUpdateValidator, opts.validates.onSave)

      Object.defineProperty(this, '__validators', {
        value: {
          onCreate: onCreateValidator,
          onUpdate: onUpdateValidator
        }
      })
    }
  }

  map (param) {
    if (param instanceof Array) {
      return param.map(obj => this.new(obj))
    } else {
      return this.new(param)
    }
  }

  new (props = {}) {
    return new Objet(this, props)
  }

  where (keys = {}) {
    const newKeys = Object.assign({}, this.__keys, keys)

    return new this.constructor(this.__opts, newKeys)
  }

  creatable (record, prop = null) {
    return this.__validate(this.__validators.onCreate, record, prop)
  }

  updatable (record, prop = null) {
    return this.__validate(this.__validators.onUpdate, record, prop)
  }

  // protected

  __validate (validator, record, prop) {
    if (prop) {
      return validator.validate(record, prop)
    } else {
      return validator.validateAll(record)
    }
  }

  __caller (action) {
    const config = Object.assign({}, this.__api.config, action.config)

    if (Scope.onCollection(action.scope)) {
      return (data) => {
        let body = data
        let headers = {}

        if (config.json) {
          const prepared = API.toJSON(body, headers)

          body = prepared.body
          headers = prepared.headers
        }

        return action.call({
          headers: headers,
          data: body,
          keys: this.__keys
        })
      }
    } else {
      return (id, data) => {
        let body = data
        let headers = {}

        if (config.json) {
          const prepared = API.toJSON(body, headers)

          body = prepared.body
          headers = prepared.headers
        }

        return action.call({
          headers: headers,
          id: id,
          body: body,
          keys: this.__keys
        })
      }
    }
  }
}
