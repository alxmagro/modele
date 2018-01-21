import Rule from '../structures/rule'
import is from 'is_js'

export default class Inclusion extends Rule {
  definitions (options) {
    if (options.in) {
      return {
        name: 'inclusion',
        test: (value) => is.inArray(value, this.solved(options.in))
      }
    }

    throw new TypeError('Enter "in" option')
  }
}
