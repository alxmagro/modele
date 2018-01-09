import _ from 'lodash'
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

  addRule (prop, name, options) {
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

    this.rules[prop] = this.rules[prop] || []
    this.rules[prop].push(rule)
  }

  addRules (config) {
    _.each(config, (rules, prop) => {
      _.each(rules, (options, name) => {
        this.addRule(prop, name, options)
      })
    })
  }

  validateProp (record, prop) {
    const errors = []

    _.each(this.rules[prop], rule => {
      const error = rule.run(record, prop)

      if (error) errors.push(error)
    })

    return errors
  }

  validate (record) {
    const errors = {}

    _.each(this.rules, (rules, prop) => {
      const attrErrors = this.validateProp(record, prop)

      if (attrErrors.length) errors[prop] = attrErrors
    })

    return errors
  }
}
