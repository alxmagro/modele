const isEmpty = function (value) {
  return (
    // null or undefined
    (value == null) ||

    // has length and it's zero
    (value.length === 0) ||

    // is an Object and has no keys
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * Returns true if value is null, has length zero or has no keys.
 */
export function absence () {
  return {
    name: 'absence',
    test: (value) => isEmpty(value)
  }
}

/**
 * Returns true if value is truthy.
 */
export function acceptance () {
  return {
    name: 'acceptance',
    test: (value) => !!value
  }
}

/**
 * Returns true if value is equal to another.
 */
export function confirmation (other) {
  return {
    name: 'confirmation',
    test: (value, json) => value === json[other],
    data: { other }
  }
}

/**
 * Returns true if value is an date after another.
 */
export function dateAfter (start) {
  start = start()

  return {
    name: 'dateAfter',
    test: (value) => value > start,
    data: { start }
  }
}

/**
 * Returns true if value is an date before another.
 */
export function dateBefore (end) {
  end = end()

  return {
    name: 'dateBefore',
    test: (value) => value < end,
    data: { end }
  }
}

/**
 * Returns true if value is an date between to dates.
 */
export function dateBetween (start, end) {
  start = start()
  end = end()

  return {
    name: 'dateBetween',
    test: (value) => value > start && value < end,
    data: { start, end }
  }
}

/**
 * Returns true if value is not included to list.
 */
export function exclusion (list) {
  return {
    name: 'exclusion',
    test: (value) => !list.includes(value),
    data: { list }
  }
}

/**
 * Returns true if value matches with regexp.
 */
export function format (regexp) {
  return {
    name: 'format',
    test: (value) => regexp.test(value),
    data: { regexp }
  }
}

/**
 * Returns true if value is future.
 */
export function future () {
  return {
    name: 'future',
    test: (value) => value > new Date()
  }
}

/**
 * Returns true if value is included to list.
 */
export function inclusion (list) {
  return {
    name: 'inclusion',
    test: (value) => list.includes(value),
    data: { list }
  }
}

export function lengthBetween (min, max) {
  return {
    name: 'lengthBetween',
    test: (value) => value.length >= min && value.length <= max,
    data: { min, max }
  }
}

export function lengthIs (size) {
  return {
    name: 'lengthIs',
    test: (value) => value.length === size,
    data: { size }
  }
}

export function lengthMax (max) {
  return {
    name: 'lengthMax',
    test: (value) => value.length <= max,
    data: { max }
  }
}

export function lengthMin (min) {
  return {
    name: 'lengthMin',
    test: (value) => value.length >= min,
    data: { min }
  }
}

/**
 * Returns true if value is past.
 */
export function past () {
  return {
    name: 'past',
    test: (value) => value < new Date()
  }
}

/**
 * Returns true if value is not null, has length greater than zero or has keys.
 */
export function presence () {
  return {
    name: 'presence',
    test: (value) => !isEmpty(value)
  }
}
