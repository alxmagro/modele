import { Rule } from '../'
import is from 'is_js'

export default () => {
  return new Rule({
    name: 'past',
    test: (value) => is.past(value)
  })
}
