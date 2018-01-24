export default class Rule {

  /**
   * @summary Create an instance of Rule
   * @name Rule
   * @class
   * @public
   *
   * @param {*} [options] Options that can be used in definitions and test
   * @returns {Rule} Rule instance
   */
  constructor (options = {}) {
    const definitions = this.definitions(options)

    this.name = definitions.name
    this.test = definitions.test
    this.options = options
  }

  // interfaces

  /**
   * @summary Function that returns the name and test of Rule
   * @function
   * @abstract
   * @public
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
   * @summary Check if rule has options "if" (and it's true) and check scope ("on")
   * @function
   * @public
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
   * @summary Tests the rule on a property (prop) of an object (record)
   * @function
   * @public
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
   * @summary Calls the value if this is a function, otherwise it returns itself
   * @function
   * @public
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
