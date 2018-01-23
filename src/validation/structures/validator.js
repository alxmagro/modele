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

export default class Validator {
  constructor (additions = {}) {
    this.ruleset = Object.assign({}, DEFAULT_RULESET, additions)
    this.rules = {}
  }

  setRules (schema = {}) {
    for (const prop in schema) {
      // init ruleset
      this.rules[prop] = []

      // add rules
      for (const ruleName in schema[prop]) {
        const rule = this.buildRule(ruleName, schema[prop][ruleName])

        this.rules[prop].push(rule)
      }
    }
  }

  buildRule (name, options) {
    const Constructor = this.ruleset[name]

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

  validateProp (record, prop, scope = null) {
    const rules = this.rules[prop] || []

    return rules
      .filter(rule => rule.elegible(scope))
      .map(rule => rule.verify(record, prop))
      .filter(x => x)
  }

  validate (record, scope = null) {
    const errors = {}

    for (const prop in this.rules) {
      errors[prop] = this.validateProp(record, prop, scope)
    }

    return errors
  }
}
