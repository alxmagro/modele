import _isEqual from 'lodash/isEqual'

export default class Map {

  /**
   * @summary Create an instance of Map
   * @name Map
   * @class
   * @public
   *
   * @param {*} [empty] Represetation of empty state
   * @returns {Map} Map instance
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
   * @summary Return all values
   * @function
   * @public
   *
   * @return {Object}
   */
  all () {
    return this.hash
  }

  /**
   * @summary Get a value
   * @function
   * @public
   *
   * @param  {string} prop
   * @return {*}
   */
  get (prop) {
    return this.hash[prop]
  }

  // setters

  /**
   * @summary Set all values
   * @function
   * @public
   *
   * @param  {Object} [hash]
   */
  record (hash = {}) {
    this.hash = hash
  }

  /**
   * @summary Set a value
   * @function
   * @public
   *
   * @param {string} prop
   * @param {*} value
   */
  set (prop, value) {
    this.hash[prop] = value
  }

  // verificators

  /**
   * @summary Check if property exists and it is different to empty value
   * @function
   * @public
   *
   * @param  {string} prop
   * @return {Boolean}
   */
  has (prop) {
    return this.hash[prop] != null && !_isEqual(this.hash[prop], this.empty)
  }

  /**
   * @summary Check if any property exists and is different to empty value
   * @function
   * @public
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
   * @summary Clear a given property, or all of them
   * @function
   * @public
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
