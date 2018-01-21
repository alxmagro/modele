import Rule from '../structures/rule'
import is from 'is_js'

export default class Acceptance extends Rule {
  definitions () {
    return {
      name: 'acceptance',
      test: (value) => is.truthy(value)
    }
  }
}
