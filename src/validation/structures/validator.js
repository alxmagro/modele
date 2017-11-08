import _ from 'lodash'
import absence from '../rules/absence'
import acceptance from '../rules/acceptance'
import confirmation from '../rules/confirmation'
import exclusion from '../rules/exclusion'
import format from '../rules/format'
import inclusion from '../rules/inclusion'
import length from '../rules/length'
import presence from '../rules/presence'

const DEFAULT_RULESET = {
  absence,
  acceptance,
  confirmation,
  exclusion,
  format,
  inclusion,
  length,
  presence
}

export default class Validator {
  /**
   *
   * param {Object} ruleset JSON with Rule name and constructor
   */
  constructor (ruleset, schema) {
    this.ruleset = ruleset || DEFAULT_RULESET
    this.rules = {}

    if (schema) {
      this.addRules(schema)
    }
  }

  addRule (attribute, name, options) {
    if (!this.ruleset[name]) {
      throw new TypeError(`Rule "${name}" is not defined`)
    }

    if (options === false) {
      return
    }

    if (options === true) {
      options = {}
    }

    const rule = this.ruleset[name](options)

    this.rules[attribute] = this.rules[attribute] || []
    this.rules[attribute].push(rule)
  }

  addRules (config) {
    _.each(config, (rules, attribute) => {
      _.each(rules, (options, name) => {
        this.addRule(attribute, name, options)
      })
    })
  }

  validateAttribute (record, attribute) {
    const errors = []

    _.each(this.rules[attribute], rule => {
      const error = rule.validate(record, attribute)

      if (error) errors.push(error)
    })

    return errors
  }

  validate (record) {
    const errors = {}

    _.each(this.rules, (rules, attribute) => {
      const attrErrors = this.validateAttribute(record, attribute)

      if (attrErrors.length) errors[attribute] = attrErrors
    })

    return errors
  }
}
