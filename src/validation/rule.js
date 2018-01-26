/**
 * Class that represents a rule that can be validated
 */
export default class Rule {
  /**
   * Create an Rule instance
   *
   * @param {*} [options] Options that can be used in definitions and test
   */
  constructor (options = {}) {
    const definitions = this.definitions(options)

    this.name = definitions.name
    this.test = definitions.test
    this.options = options
  }

  // interfaces

  /**
   * Function that returns the name and test of Rule
   *
   * @param  {Object} [options] Received options in constructor
   * @return {Object}
   *
   * @example
   * class IsNull extends Rule {
   *   definitions () {
   *     return {
   *       name: 'is_null'
   *       test: (value) => value === null
   *     }
   *   }
   * }
   */
  definitions (options) {}

  // methods

  /**
   * Check if rule has options "if" (and it's true) and check scope ("on")
   *
   * @param  {string} [scope]
   * @return {boolean}
   */
  elegible (scope) {
    const isActive = !this.options.if || this.options.if()
    const onScope = !this.options.on || this.options.on === scope

    return isActive && onScope
  }

  /**
   * Tests the rule on a property (prop) of an object (record)
   *
   * @param  {Object} record
   * @param  {string} prop
   * @return {undefined|Object} the error object if test fails
   */
  verify (record, prop) {
    const value = record[prop]
    const valid = this.test(value, record, prop)

    if (!valid) {
      return {
        name: this.name,
        validator: 'modele',
        context: Object.assign({}, this.options, { record, prop, value })
      }
    }
  }

  // helpers

  /**
   * Calls the value if this is a function, otherwise it returns itself
   *
   * @param  {*} value
   * @return {*}
   */
  solved (value) {
    return (typeof value === 'function')
      ? value()
      : value
  }
}
