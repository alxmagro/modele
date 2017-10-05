import Base from './base'

export default class Presence extends Base {
  constructor (opts = {}) {
    super(opts)
  }

  perform (record, prop) {
    const value = record[prop]

    if (this.constructor.isBlank(value)) {
      return this.errorMessage('blank', record, prop)
    }
  }
}
