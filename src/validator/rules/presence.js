import Base from './base'

export default class Presence extends Base {
  constructor (opts = {}) {
    super(opts)
  }

  perform (record, prop, errors) {
    const value = record[prop]

    if (this.constructor.isBlank(value)) {
      errors.add(prop, {
        error: 'blank',
        ctx: { record, prop, value }
      })
    }
  }
}
