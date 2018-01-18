import _get from 'lodash/get'
import _merge from 'lodash/merge'

export default class Rule {
  constructor (config = {}) {
    this.name = _get(config, 'name')
    this.test = _get(config, 'test', () => true)
    this.data = _get(config, 'data', {})
  }

  run (record, attribute) {
    const value = record[attribute]
    const valid = this.test(value, record, attribute)

    if (!valid) {
      return {
        name: this.name,
        context: _merge({}, this.data, { record, attribute, value })
      }
    }
  }
}
