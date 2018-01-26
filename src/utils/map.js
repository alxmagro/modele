import _isEqual from 'lodash/isEqual'

/**
 * Class that represents a set of key-value pairs with helpfull things
 */
export default class Map {
  /**
   * Create a Map instance
   *
   * @param {*} [empty] Represetation of empty state
   *
   * @example
   * new Map(false)
   * new Map([])
   */
  constructor (empty) {
    this.empty = empty
    this.hash = {}
  }

  // getters

  /**
   * Return all values
   *
   * @return {Object}
   */
  all () {
    return this.hash
  }

  /**
   * Get a value
   *
   * @param  {string} prop
   * @return {*}
   */
  get (prop) {
    return this.hash[prop]
  }

  // setters

  /**
   * Set all values
   *
   * @param  {Object} [hash]
   */
  record (hash = {}) {
    this.hash = hash
  }

  /**
   * Set a value
   *
   * @param {string} prop
   * @param {*} value
   */
  set (prop, value) {
    this.hash[prop] = value
  }

  // verificators

  /**
   * Check if property exists and it is different to empty value
   *
   * @param  {string} prop
   * @return {Boolean}
   */
  has (prop) {
    return this.hash[prop] != null && !_isEqual(this.hash[prop], this.empty)
  }

  /**
   * Check if any property exists and is different to empty value
   *
   * @return {Boolean}
   */
  any () {
    for (const prop in this.hash) {
      if (this.has(prop)) return true
    }

    return false
  }

  // destroyers

  /**
   * Clear a given property, or all of them
   *
   * @param  {prop}
   */
  clear (prop) {
    if (prop) {
      return this.set(prop, this.empty)
    }

    Object.keys(this.hash).forEach(key => this.clear(key))
  }
}
