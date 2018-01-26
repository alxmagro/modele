import Rule from '../rule'

export default class Length extends Rule {
  definitions (options) {
    if (options.is) {
      return {
        name: 'length',
        test: (value) => value.length === options.is
      }
    }

    if (options.min) {
      if (options.max) {
        return {
          name: 'length_between',
          test: (value) => value.length <= options.max && value.length >= options.min
        }
      } else {
        return {
          name: 'length_min',
          test: (value) => value.length >= options.min
        }
      }
    }

    if (options.max) {
      return {
        name: 'length_max',
        test: (value) => value.length <= options.max
      }
    }

    return new TypeError('Supply options "is", "min" and/or "max"')
  }
}
