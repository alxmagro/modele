import Rule from '../core/rule'
import is from 'is_js'

export default class Confirmation extends Rule {
  definitions (options) {
    if (options.with) {
      return {
        name: 'confirmation',
        test: (value, record) => is.equal(value, record[options.with])
      }
    }

    throw new TypeError('Enter "with" option')
  }
}
