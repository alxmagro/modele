import Base from './base'
import Helpers from '../../support/helpers'

export default class Exclusion extends Base {
  /*
    @param {Array|function} opts.in - values that are invalids
  */
  constructor (opts = {}) {
    super(opts)
    Helpers.checkPresence(this, ['in'], opts)

    this.list = opts.in
  }

  perform (record, prop, errors) {
    const value = record[prop]
    const list = this.solvedList(record)

    if (list.includes(value)) {
      errors.add(prop, {
        error: 'exclusion',
        ctx: { record, prop, value, list }
      })
    }
  }

  solvedList (record) {
    return (typeof this.list === 'function') ? this.list(record) : this.list
  }
}
