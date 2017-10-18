import _ from 'lodash'
import Base from './base'

const DEFAULTS = {
  accept: ['1', true]
}

export default class Acceptance extends Base {
  /*
    @param {Object|Object[]} [opts.accept] - values that are accepteds
  */
  constructor (opts = {}) {
    opts = Object.assign({}, DEFAULTS, opts)

    super(opts)

    this.accept = opts.accept
  }

  perform (record, prop, errors) {
    const value = record[prop]
    const acceptable = _.castArray(this.accept).includes(value)

    if (!acceptable) {
      errors.add(prop, {
        error: 'accepted',
        ctx: { record, prop, value, accept: this.accept }
      })
    }
  }
}
