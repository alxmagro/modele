import _ from 'lodash'

import Builder from './builder'
import Errors from './validator/errors'
import Scope from './api/scope'

export default class Objet {
  constructor (modele, props, keys = {}) {
    props = Object.assign({}, props)

    // data and associations
    const data = _.get(modele.__opts, 'data', () => ({}))
    const associations = _.get(modele.__opts, 'associations', {})

    Builder.defineData(props, data)
    Builder.defineAssociations(props, associations)

    Object.assign(this, props)

    // basic
    Object.defineProperty(this, '__modele', {
      value: modele
    })

    Object.defineProperty(this, '__keys', {
      value: keys
    })

    Object.defineProperty(this, '__original', {
      value: props
    })

    Object.defineProperty(this, 'errors', {
      value: new Errors()
    })

    // actions
    if (this.__modele.__api) {
      const actions = _.pickBy(this.__modele.__api.actions, action => {
        return Scope.onMember(action.scope)
      })

      Builder.defineActions(this, actions)
    }

    // computed
    const computed = _.get(modele.__opts, 'computed', {})

    Builder.defineComputed(this, computed)

    // methods
    const methods = _.get(modele.__opts, 'methods', {})

    Builder.defineMethods(this, methods)
  }

  where (keys = {}) {
    const newKeys = Object.assign({}, this.__keys, keys)

    return new this.constructor(this.__modele, this.__original, newKeys)
  }

  changed () {
    for (const prop in this.__original) {
      if (this[prop] !== this.__original[prop]) return true
    }

    return false
  }

  unchanged () {
    return !this.changed()
  }

  persisted () {
    return this.id != null
  }

  valid (opts = {}) {
    const errors = this.__modele.validate(this, opts)

    if (opts.prop) {
      for (const name in errors.all()) this.errors.set(name, errors.get(name))
    } else {
      this.errors.record(errors.all())
    }

    return !this.errors.any()
  }

  save () {
    if (this.persisted()) {
      return this.__modele.update(this.id, this)
    }

    return this.__modele.create(this)
  }

  // protected

  __caller (action) {
    return (data) => {
      return action.call({
        id: this.id,
        data: data,
        keys: this.__keys,
        config: this.__modele.__api.config
      })
    }
  }
}
