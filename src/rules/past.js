import Rule from '../core/rule'
import is from 'is_js'

export default class Past extends Rule {
  definitions () {
    return {
      name: 'past',
      test: (value) => is.past(value)
    }
  }
}