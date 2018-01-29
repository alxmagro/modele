/**
 * Get a rule by name into a given ruleset, and build it with options
 *
 * @param  {Object} ruleset
 * @param  {string} name
 * @param  {boolean|Object} options
 * @return {Rule} a Rule instance
 */
const buildRule = function (ruleset, name, options) {
  const Constructor = ruleset[name]

  if (!Constructor) {
    throw new TypeError(`Rule "${name}" is not defined`)
  }

  if (options === false) {
    return
  }

  if (options === true) {
    options = {}
  }

  return new Constructor(options)
}

/**
 * Class that represents a Validator
 */
export default class Validator {
  /**
   * @summary Create a Validator instance
   *
   * @param {Object} ruleset
   * @param {Object} schema
   *
   * @example
   * new Validator({
   *   name: { presence: true, length: { min: 8 } }
   * })
   */
  constructor (ruleset, schema = {}) {
    this.rules = {}

    for (const prop in schema) {
      // init ruleset
      this.rules[prop] = []

      // add rules
      for (const name in schema[prop]) {
        const options = schema[prop][name]
        const rule = buildRule(ruleset, name, options)

        this.rules[prop].push(rule)
      }
    }
  }

  /**
   * Check a record property with elegible rules on this.rules
   *
   * @param  {Object} record
   * @param  {string} prop
   * @param  {string} [scope]
   * @return {Array} an Array of errors
   */
  validateProp (record, prop, scope = null) {
    const rules = this.rules[prop] || []

    return rules
      .filter(rule => rule.elegible(scope))
      .map(rule => rule.verify(record, prop))
      .filter(x => x)
  }

  /**
   * Check a record with elegible rules on this.rules
   *
   * @param  {Object} record
   * @param  {string} [scope]
   * @return {Object<{property: string, errors: Array}>} an dictionary of errors
   */
  validate (record, scope = null) {
    const errors = {}

    for (const prop in this.rules) {
      errors[prop] = this.validateProp(record, prop, scope)
    }

    return errors
  }
}
