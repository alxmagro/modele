import ruleset from './ruleset'

export default class Validator {
  constructor (additions = {}) {
    this.ruleset = Object.assign({}, ruleset, additions)
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
