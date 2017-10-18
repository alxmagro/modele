import _ from 'lodash'

import Base from './base'
import Helpers from '../../support/helpers'

const MESSAGES = {
  is: 'wrong_length',
  min: 'too_short',
  max: 'too_long'
}

const PREDICATES = {
  is: (value, expected) => value === expected,
  min: (value, expected) => value >= expected,
  max: (value, expected) => value <= expected
}

export default class Length extends Base {
  /*
    @param {number} opts.is - The exact size of the attribute
    @param {number} opts.min - The minimum size of the attribute
    @param {number} opts.max - The maximum size of the attribute
  */
  constructor (opts = {}) {
    super(opts)
    Helpers.checkType(this, {
      is: 'number',
      min: 'number',
      max: 'number'
    }, opts)

    this.is = opts.is
    this.min = opts.min
    this.max = opts.max
  }

  perform (record, prop, errors) {
    const value = record[prop]

    for (const name in PREDICATES) {
      const expected = this[name]
      const input = _.isNil(value) ? '' : value

      if (!expected) continue

      if (PREDICATES[name](input.length, expected) === false) {
        errors.add(prop, {
          error: MESSAGES[name],
          ctx: { record, prop, value, expected }
        })
      }
    }
  }
}
