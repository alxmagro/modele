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

const DEFAULT = {
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
 * Class that represents a rule dictionary
 */
export default class RuleDict {
  constructor (rules = {}) {
    this.definitions = DEFAULT
    this.append(rules)
  }

  append (rules) {
    for (const name in rules) {
      this.set(name, rules[name])
    }
  }

  set (name, rule) {
    this.definitions[name] = rule
  }

  get (name, options) {
    const Constructor = this.definitions[name]

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
}
