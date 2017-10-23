import _ from 'lodash'
import Builder from './builder'
import API from './api/api'
import Objet from './objet'
import Scope from './api/scope'
import Validator from './validator/validator'
import Errors from './validator/errors'

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
      const scopes = _.get(opts, 'validates', {})
      const validators = {}

      Object.keys(scopes).forEach(scope => {
        const scopeRules = _.get(opts, ['validates', scope], {})
        const validator = new Validator(config)

        Builder.addRulesToValidator(validator, scopeRules)

        validators[scope] = validator
      })

      Object.defineProperty(this, '__validators', { value: validators })
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

  validate (record, opts = {}) {
    const errors = new Errors()

    // validate scope supplied by 'opts.on'
    if (opts.on) {
      const validator = this.__validators[opts.on]

      if (!validator) {
        throw new TypeError(`Modele Error: Validator ${opts.on} not supplied.`)
      }

      errors.merge(validator.validate(record, opts.prop))
    }

    // validate defaults
    if (this.__validators.defaults) {
      const validator = this.__validators.defaults

      errors.merge(validator.validate(record, opts.prop))
    }

    return errors
  }

  // protected

  __caller (action) {
    return (...args) => {
      let id, data

      if (Scope.onCollection(action.scope)) {
        [data] = args
      } else {
        [id, data] = args
      }

      return action.call({
        id: id,
        data: data,
        keys: this.__keys,
        config: this.__api.config
      })
    }
  }
}
