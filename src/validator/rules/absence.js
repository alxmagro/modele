import Base from './base'

export default class Absence extends Base {
  constructor (opts = {}) {
    super(opts)
  }

  perform (record, prop, errors) {
    const value = record[prop]

    if (this.constructor.isPresent(value)) {
      errors.add(prop, {
        error: 'present',
        ctx: { record, prop, value }
      })
    }
  }
}
