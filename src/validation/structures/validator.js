import absence from '../rules/absence'
import acceptance from '../rules/acceptance'
import confirmation from '../rules/confirmation'
import date from '../rules/date'
import exclusion from '../rules/exclusion'
import format from '../rules/format'
import future from '../rules/future'
import inclusion from '../rules/inclusion'
import length from '../rules/length'
import past from '../rules/past'
import presence from '../rules/presence'

/**
 * @summary Default Validator ruleset
 * @type Object
 * @constant
 * @private
 */
const DEFAULT_RULESET = {
  absence,
  acceptance,
  confirmation,
  date,
  exclusion,
  format,
  future,
  inclusion,
  length,
  past,
  presence
}

/**
 * @summary Get a rule by name into a given ruleset, and build it with options
 * @function
 * @private
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

export default class Validator {

  /**
   * @summary Create an instance of Validator
   * @name Validator
   * @class
   * @public
   *
   * @param {Object} schema
   * @param {Object} [additions] Custom rules to add to ruleset
   * @returns {Validator} Validator instance
   *
   * @example
   * new Validator({
   *   name: { presence: true, length: { min: 8 } }
   * })
   */
  constructor (schema = {}, additions = {}) {
    this.ruleset = Object.assign({}, DEFAULT_RULESET, additions)
    this.rules = {}

    for (const prop in schema) {
      // init ruleset
      this.rules[prop] = []

      // add rules
      for (const ruleName in schema[prop]) {
        const rule = buildRule(this.ruleset, ruleName, schema[prop][ruleName])

        this.rules[prop].push(rule)
      }
    }
  }

  /**
   * @summary Check a record property with elegible rules on this.rules
   * @function
   * @public
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
   * @summary Check a record with elegible rules on this.rules
   * @function
   * @public
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
