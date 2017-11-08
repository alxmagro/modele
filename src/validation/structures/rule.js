import _ from 'lodash'

export default class Rule {
  constructor (config = {}) {
    this.name = _.get(config, 'name')
    this.test = _.get(config, 'test', _.stubTrue)
    this.data = _.get(config, 'data', {})
  }

  validate (record, attribute) {
    const value = record[attribute]
    const valid = this.test(value, record, attribute)

    if (!valid) {
      return {
        name: this.name,
        context: _.merge({}, this.data, { record, attribute, value })
      }
    }
  }
}
