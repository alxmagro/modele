import Base from './base'
import Helpers from '../../support/helpers'

export default class Inclusion extends Base {
  /*
    @param {Object[]|function} opts.in - values that are valids
  */
  constructor (opts = {}) {
    super(opts)
    Helpers.checkPresence(this, ['in'], opts)
    Helpers.checkType(this, { in: ['object', 'function'] }, opts)

    this.list = opts.in
  }

  perform (record, prop) {
    const value = record[prop]
    const list = this.solvedList(record)

    if (!list.includes(value)) {
      return this.errorMessage('inclusion', record, prop, {
        list: list
      })
    }
  }

  solvedList (record) {
    return (typeof this.list === 'function') ? this.list(record) : this.list
  }
}
