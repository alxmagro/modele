import Rule from '../structures/rule'
import is from 'is_js'

export default class Date extends Rule {
  definitions (options) {
    const before = options.before && this.solved(options.before)
    const after = options.after && this.solved(options.after)

    if (after && before) {
      return {
        name: 'date_between',
        test: (value) => is.inDateRange(value, after, before)
      }
    }

    if (before) {
      return {
        name: 'date_before',
        test: (value) => value < before
      }
    }

    if (after) {
      return {
        name: 'date_after',
        test: (value) => value > after
      }
    }

    throw new TypeError('Enter "before" and/or "after" option')
  }
}
