export default class Rule {
  constructor (options = {}) {
    const definitions = this.definitions(options)

    this.name = definitions.name
    this.test = definitions.test
    this.options = options
  }

  // interfaces

  definitions (options) {
    return {}
  }

  // methods

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

  elegible (scope) {
    return this.isActive() && this.onScope(scope)
  }

  isActive () {
    return !this.options.if || this.options.if()
  }

  onScope (scope) {
    return !this.options.on || this.options.on === scope
  }

  // helpers

  solved (value) {
    return (typeof value === 'function')
      ? value()
      : value
  }
}
