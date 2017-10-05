import Base from './base'

export default class Absence extends Base {
  constructor (opts = {}) {
    super(opts)
  }

  perform (record, prop) {
    const value = record[prop]

    if (this.constructor.isPresent(value)) {
      return this.errorMessage('present', record, prop)
    }
  }
}
