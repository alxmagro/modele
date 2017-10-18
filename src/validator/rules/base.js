import _ from 'lodash'
import Errors from '../errors'
import Helpers from '../../support/helpers'

export default class Base {
  /*
    @param {boolean|function} [opts.if] - disable/enable validation
  */
  constructor (opts = {}) {
    Helpers.checkType(this, {
      if: ['boolean', 'function'],
      allowNull: 'boolean',
      allowBlank: 'boolean'
    }, opts)

    this.condition = opts.if
    this.allowNull = opts.allowNull
    this.allowBlank = opts.allowBlank
  }

  static isBlank (value) {
    switch (typeof value) {
      case 'boolean': {
        return false
      }
      case 'function': {
        return false
      }
      case 'number': {
        return _.isNaN(value)
      }
      case 'string': {
        return !_.trim(value)
      }
      default: {
        return _.isEmpty(value)
      }
    }
  }

  static isPresent (value) {
    return !Base.isBlank(value)
  }

  elegible (record) {
    if (_.isNil(this.condition)) {
      return true
    }

    if (typeof this.condition === 'function') {
      return this.condition(record)
    }

    return this.condition
  }

  validate (record, prop) {
    const errors = new Errors()
    const value = record[prop]

    if ((this.allowBlank && Base.isBlank(value)) ||
        (this.allowNil && _.isNil(value)) ||
        !this.elegible(record)) {
      return errors
    }

    this.perform(record, prop, errors)

    return errors
  }

  perform (record, prop) {
    throw new TypeError('perform should be overriden')
  }
}
