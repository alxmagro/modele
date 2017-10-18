import Base from './base'
import Helpers from '../../support/helpers'

const DEFAULTS = {
  caseSensitive: true
}

export default class Confirmation extends Base {
  /*
    @param {string} opts.with - name of confirmation property
    @param {boolean} [opts.caseSensitive]
  */
  constructor (opts = {}) {
    opts = Object.assign({}, DEFAULTS, opts)

    super(opts)
    Helpers.checkPresence(this, ['with'], opts)
    Helpers.checkType(this, { with: 'string', caseSensitive: 'boolean' }, opts)

    this.caseSensitive = opts.caseSensitive
    this.confirmation = opts.with
  }

  perform (record, prop, errors) {
    const value = record[prop]
    const confirmation = this.confirmation
    const confirmed = this.isEqual(value, record[confirmation])

    if (!confirmed) {
      errors.add(confirmation, {
        error: 'confirmation',
        ctx: {
          record,
          prop: confirmation,
          value: record[confirmation],
          referred: prop
        }
      })
    }
  }

  isEqual (first, second) {
    if (this.caseSensitive) {
      return first === second
    }

    return first.toUpperCase() === second.toUpperCase()
  }
}
