import Rule from '../structures/rule'
import is from 'is_js'

export default class Presence extends Rule {
  definitions () {
    return {
      name: 'presence',
      test: (value) => is.existy(value) && is.not.empty(value)
    }
  }
}
