/**
 * Class representing a model property errors.
 */
export default class Errors {
  /**
   * Create a Errors
   *
   * @param  {Object} props - Properties to be initialized.
   */
  constructor (props = []) {
    this.items = {}

    props.forEach(item => this.set(item, []))
  }

  /**
   * Add an error to an property.
   *
   * @param {string} prop
   * @param {*} data
   */
  add (prop, data) {
    this.items[prop].push(data)
  }

  /**
   * Returns true if has any error to given property or all of them.
   *
   * @param  {string} prop
   * @return {Boolean}
   */
  any (prop) {
    if (prop) {
      return this.items[prop].length > 0
    }

    return Object.keys(this.items).some(prop => this.any(prop))
  }

  /**
   * Clear all errors.
   */
  clear () {
    for (const prop in this.items) {
      this.items[prop] = []
    }
  }

  /**
   * Returns true if has no errors to given property or any of them.
   *
   * @param  {string} prop
   * @return {Boolean}
   */
  empty (prop) {
    if (prop) {
      return this.items[prop].length === 0
    }

    return Object.keys(this.items).every(prop => this.empty(prop))
  }

  /**
   * Set property errors
   *
   * @param {string} prop
   * @param {Array} data
   */
  set (prop, data) {
    this.items[prop] = data
  }
}
