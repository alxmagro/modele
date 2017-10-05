import _ from 'lodash'
import Computed from './computed'

export default {
  defineAssociations (dest, associations) {
    if (!dest) return

    for (const name in associations) {
      const modele = associations[name]

      if (dest[name]) {
        dest[name] = modele.map(dest[name])
      }
    }
  },

  defineActions (dest, src) {
    _.forOwn(src, (action, name) => {
      Object.defineProperty(dest, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: dest.__caller(action)
      })
    })
  },

  /*
    Receive a function that returns a Object and assigns props to dest
    @param {Object} dest - Who will receive props
    @param {function} src - Function that returns a Object with props that will assigned
  */
  defineData (dest, src) {
    if (typeof src !== 'function') {
      throw new TypeError('Data should be a function that return a object')
    }

    const data = src()

    for (const name in data) {
      dest[name] = data[name]
    }
  },

  /*
    Receive a Object that props values are { set, get } and define properties to dest with it
    @param {Object} dest - Who will receive props
    @param {Object} src - Who contains computed definitions
  */
  defineComputed (dest, src) {
    if (typeof src !== 'object') {
      throw new TypeError('Computed should be a hash { name, function }')
    }

    for (const name in src) {
      const computed = new Computed(src[name])

      Object.defineProperty(dest, name, {
        enumerable: false,
        configurable: false,
        get: computed.get,
        set: computed.set
      })
    }
  },

  /*
    Receive a Object that props values are functions and assign to dest
    @param {Object} dest - Who will receive methods
    @param {Object} src - Who container methods
  */
  defineMethods (dest, src) {
    if (typeof src !== 'object') {
      throw new TypeError('Methods should be a hash { name, function }')
    }

    for (const name in src) {
      if (typeof src[name] !== 'function') {
        throw new TypeError('Method should be a function')
      }

      Object.defineProperty(dest, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: src[name]
      })
    }
  },

  /*
    Receive a validator and Objects with validations descriptions
    @param {Validator} validator - Who will receive rules
    @param {Object} src - { 'object prop' : { 'rule key' : 'rule opts' } }
  */
  addRulesToValidator (validator, src) {
    for (const prop in src) {
      const rules = src[prop]

      for (const key in rules) {
        let opts = rules[key]

        if (opts === false) continue
        if (opts === true) opts = {}

        validator.addRule(key, prop, opts)
      }
    }
  }
}
