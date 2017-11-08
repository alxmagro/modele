import { Rule } from '../'
import is from 'is_js'

export default () => {
  return new Rule({
    name: 'acceptance',
    test: (value) => is.truthy(value)
  })
}
