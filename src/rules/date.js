import Rule from '../core/rule'

export default class Date extends Rule {
  definitions (options) {
    const end = options.before && this.solved(options.before)
    const start = options.after && this.solved(options.after)

    if (start && end) {
      return {
        name: 'date_between',
        test: (value) => value < end && value > start
      }
    }

    if (end) {
      return {
        name: 'date_before',
        test: (value) => value < end
      }
    }

    if (start) {
      return {
        name: 'date_after',
        test: (value) => value > start
      }
    }

    throw new TypeError('Enter "before" and/or "after" option')
  }
}
