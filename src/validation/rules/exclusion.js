import { Rule, solved } from '../'
import is from 'is_js'

export default (obj) => {
  if (obj.in) {
    return new Rule({
      name: 'exclusion',
      test: (value) => is.not.inArray(value, solved(obj.in))
    })
  }

  throw new TypeError('Enter "in" option')
}
