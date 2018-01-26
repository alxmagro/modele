import Rule from '../rule'
import is from 'is_js'

export default class Exclusion extends Rule {
  definitions (options) {
    if (options.in) {
      return {
        name: 'exclusion',
        test: (value) => is.not.inArray(value, this.solved(options.in))
      }
    }

    throw new TypeError('Enter "in" option')
  }
}
