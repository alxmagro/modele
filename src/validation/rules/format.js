import Rule from '../structures/rule'

export default class Format extends Rule {
  definitions (options) {
    if (options.with) {
      return {
        name: 'format',
        test: (value) => options.with.test(value)
      }
    }

    throw new TypeError('Enter "with" option')
  }
}
