import _ from 'lodash'

export default {
  /*
    Throw TypeError if any prop are not present
    @param {Array} list - list of props
    @param {Object} opts - Object where props should be defined
  */
  checkPresence (target, list = [], opts = {}) {
    list.forEach(name => {
      if (_.isNil(opts[name])) {
        throw new TypeError(`${target.constructor.name} require "${name}" option`)
      }
    })
  },

  /*
    Throw TypeError if typeof prop are not allowed
    @param {Object} types - props that be checked
    @papra {Array} types.<name> - array of types allowed to <name>
    @param {Object} opts - Object where prop types should be defined
  */
  checkType (target, types = {}, opts = {}) {
    for (const name in types) {
      if (_.isUndefined(opts[name])) continue

      const type = typeof opts[name]
      const allowedTypes = _.castArray(types[name])

      if (!opts[name] && !allowedTypes.includes(type)) {
        const klass = target.constructor.name
        const alloweds = JSON.stringify(types[name])

        throw new TypeError(`${klass} "${name} option should be ${alloweds}"`)
      }
    }
  }
}
