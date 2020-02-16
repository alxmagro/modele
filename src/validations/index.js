import Rule from '../core/rule'

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
 * Returns a rule that test if value is null, zero-length or has no keys.
 *
 * @return {Object} Rule instance.
 */
export function absence () {
  return new Rule({
    name: 'absence',
    test: (value) => isEmpty(value)
  })
}

/**
 * Returns a rule that test if value is truthy.
 *
 * @return {Object} Rule instance.
 */
export function acceptance () {
  return new Rule({
    name: 'acceptance',
    test: (value) => !!value
  })
}

/**
 * Returns a rule that test if value is equal to `other`.
 *
 * @return {Object} Rule instance.
 */
export function confirmation (other) {
  return new Rule({
    name: 'confirmation',
    test: (value, record) => value === record[other],
    data: { other }
  })
}

/**
 * Returns a rule that test if value is greater than `start` date.
 *
 * @return {Object} Rule instance.
 */
export function dateAfter (start) {
  return new Rule({
    name: 'dateAfter',
    test: (value) => value > start(),
    data: { start }
  })
}

/**
 * Returns a rule that test if value is lower than `end` date.
 *
 * @return {Object} Rule instance.
 */
export function dateBefore (end) {
  return new Rule({
    name: 'dateBefore',
    test: (value) => value < end(),
    data: { end }
  })
}

/**
 * Returns a rule that test if value is between `start` and `end`.
 *
 * @return {Object} Rule instance.
 */
export function dateBetween (start, end) {
  return new Rule({
    name: 'dateBetween',
    test: (value) => value > start() && value < end(),
    data: { start, end }
  })
}

/**
 * Returns a rule that test if value is not included into `list`.
 *
 * @return {Object} Rule instance.
 */
export function exclusion (list) {
  return new Rule({
    name: 'exclusion',
    test: (value) => !list.includes(value),
    data: { list }
  })
}

/**
 * Returns a rule that test if value matches with `regexp`.
 *
 * @return {Object} Rule instance.
 */
export function format (regexp) {
  return new Rule({
    name: 'format',
    test: (value) => regexp.test(value),
    data: { regexp }
  })
}

/**
 * Returns a rule that test if value is future.
 *
 * @return {Object} Rule instance.
 */
export function future (regexp) {
  return new Rule({
    name: 'future',
    test: (value) => value > new Date()
  })
}

/**
 * Returns a rule that test if value is included into `list`.
 *
 * @return {Object} Rule instance.
 */
export function inclusion (list) {
  return new Rule({
    name: 'inclusion',
    test: (value) => list.includes(value),
    data: { list }
  })
}

/**
 * Returns a rule that test if value's length is between `min` and `max`.
 *
 * @return {Object} Rule instance.
 */
export function lengthBetween (min, max) {
  return new Rule({
    name: 'lengthBetween',
    test: (value) => value.length >= min && value.length <= max,
    data: { min, max }
  })
}

/**
 * Returns a rule that test if value's length is equal to `size`.
 *
 * @return {Object} Rule instance.
 */
export function lengthIs (size) {
  return new Rule({
    name: 'lengthIs',
    test: (value) => value.length === size,
    data: { size }
  })
}

/**
 * Returns a rule that test if value's length is lower than or equal to `max`.
 *
 * @return {Object} Rule instance.
 */
export function lengthMax (max) {
  return new Rule({
    name: 'lengthMax',
    test: (value) => value.length <= max,
    data: { max }
  })
}

/**
 * Returns a rule that test if value's length is greater than or equal to `min`
 *
 * @return {Object} Rule instance.
 */
export function lengthMin (min) {
  return new Rule({
    name: 'lengthMin',
    test: (value) => value.length >= min,
    data: { min }
  })
}

/**
 * Returns a rule that test if value is past.
 *
 * @return {Object} Rule instance.
 *
 */
export function past (min) {
  return new Rule({
    name: 'past',
    test: (value) => value < new Date()
  })
}

/**
 * Returns a rule that test if value is not null, has length greater than zero or has keys.
 *
 * @return {Object} Rule instance.
 */
export function presence (min) {
  return new Rule({
    name: 'presence',
    test: (value) => !isEmpty(value)
  })
}
