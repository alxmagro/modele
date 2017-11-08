import { Rule } from '../'
import is from 'is_js'

export default (obj) => {
  if (obj.with) {
    return new Rule({
      name: 'confirmation',
      test: (value, record) => is.equal(value, record[obj.with]),
      data: obj
    })
  }

  throw new TypeError('Enter "with" option')
}
