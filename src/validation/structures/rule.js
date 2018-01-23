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

  elegible (scope) {
    const isActive = !this.options.if || this.options.if()
    const onScope = !this.options.on || this.options.on === scope

    return isActive && onScope
  }

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

  solved (value) {
    return (typeof value === 'function')
      ? value()
      : value
  }
}
