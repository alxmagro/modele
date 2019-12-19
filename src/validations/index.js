const isEmpty = function (value) {
  return (
    // null or undefined
    (value == null) ||

    // has length and it's zero
    (value.length && value.length === 0) ||

    // is an Object and has no keys
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * Returns true if value is null, has length zero or has no keys.
 */
export function absence (options) {
  return {
    name: 'absence',
    test: (value) => isEmpty(value),
    options
  }
}

/**
 * Returns true if value is truthy.
 */
export function acceptance (options) {
  return {
    name: 'acceptance',
    test: (value) => !!value,
    options
  }
}

/**
 * Returns true if value is equal to record[options.with].
 */
export function confirmation (options) {
  if (options.with) {
    return {
      name: 'confirmation',
      test: (value, record) => value === record[options.with],
      options
    }
  }

  throw new Error('Enter "with" option')
}

/**
 * Returns true if:
 *   - after, before: The date is between `after` and `before`.
 *   - before: The date is lower than `before`.
 *   - after: The date is greater than `after`.
 */
export function date (options) {
  const start = options.after()
  const end = options.before()

  if (start && end) {
    return {
      name: 'date_between',
      test: (value) => value < end && value > start,
      options
    }
  }

  if (end) {
    return {
      name: 'date_before',
      test: (value) => value < end,
      options
    }
  }

  if (start) {
    return {
      name: 'date_after',
      test: (value) => value > start,
      options
    }
  }

  throw new Error('Enter "before" and/or "after" option')
}

/**
 * Returns true if value is not included into `in`.
 */
export function exclusion (options) {
  if (options.in) {
    return {
      name: 'exclusion',
      test: (value) => !options.in.includes(value),
      options
    }
  }

  throw new Error('Enter "in" option')
}

/**
 * Returns true if value matches with regexp.
 */
export function format (options) {
  if (options.with) {
    return {
      name: 'format',
      test: (value) => options.with.test(value),
      options
    }
  }

  throw new Error('Enter "with" option')
}

/**
 * Returns true if value is future.
 */
export function future () {
  return {
    name: 'future',
    test: (value) => value > new Date(),
    options
  }
}

/**
 * Returns true if value is included into `in`.
 */
export function inclusion (options) {
  if (options.in) {
    return {
      name: 'inclusion',
      test: (value) => options.in.includes(value),
      options
    }
  }
}

/**
 * Returns true if:
 *   - is: The length of value is equal to `is`.
 *   - min, max: The length of value is between `min` and `max`.
 *   - min: The length of value is greater than `min`.
 *   - max: The length of value is lower than `max`.
 */
export function length (options) {
  if (options.is) {
    return {
      name: 'length',
      test: (value) => value.length === options.is,
      options
    }
  }

  if (options.min) {
    if (options.max) {
      return {
        name: 'length_between',
        test: (value) => value.length <= options.max && value.length >= options.min,
        options
      }
    } else {
      return {
        name: 'length_min',
        test: (value) => value.length >= options.min,
        options
      }
    }
  }

  if (options.max) {
    return {
      name: 'length_max',
      test: (value) => value.length <= options.max,
      options
    }
  }

  return new TypeError('Supply options "is", "min" and/or "max"')
}

/**
 * Returns true if value is past.
 */
export function past () {
  return {
    name: 'past',
    test: (value) => value < new Date(),
    options
  }
}

/**
 * Returns true if value is not null, has length greater than zero or has keys.
 */
export function presence () {
  return {
    name: 'presence',
    test: (value) => !isEmpty(value),
    options
  }
}
