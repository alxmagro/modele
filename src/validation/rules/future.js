import Rule from '../structures/rule'
import is from 'is_js'

export default class Future extends Rule {
  definitions () {
    return {
      name: 'future',
      test: (value) => is.future(value)
    }
  }
}
