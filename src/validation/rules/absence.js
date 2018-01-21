import Rule from '../structures/rule'
import is from 'is_js'

export default class Absence extends Rule {
  definitions () {
    return {
      name: 'absence',
      test: (value) => is.not.existy(value) || is.empty(value)
    }
  }
}
