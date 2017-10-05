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

  perform (record, prop) {
    const value = record[prop]
    const list = this.solvedList(record)

    if (list.includes(value)) {
      return this.errorMessage('exclusion', record, prop, {
        list: list
      })
    }
  }

  solvedList (record) {
    return (typeof this.list === 'function') ? this.list(record) : this.list
  }
}
