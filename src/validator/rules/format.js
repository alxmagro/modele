import Base from './base'

export default class Exclusion extends Base {
  /*
    @param {regex} opts.with - regex to be matched
    @param {regex} opts.without - regex dont to be matched

    Either .with or .without must be supplied (but not both)
  */
  constructor (opts = {}) {
    super(opts)

    this.checkOptsValidity(opts)

    this.with = opts.with
    this.without = opts.without
  }

  perform (record, prop) {
    if (!this.match(record, prop)) {
      return this.errorMessage('format', record, prop)
    }
  }

  checkOptsValidity (opts) {
    if (opts.with ? opts.without : !opts.without) {
      throw new TypeError('Either :with or :without must be supplied (but not both)')
    }
  }

  match (record, prop) {
    const value = record[prop]
    let regex = (this.with) ? this.with : this.without

    if (typeof regex === 'function') regex = regex(record)

    return (this.with && regex.test(value)) ||
           (this.without && !regex.test(value))
  }
}
