import { Rule } from '../'
import is from 'is_js'

export default () => {
  return new Rule({
    name: 'presence',
    test: (value) => is.existy(value) && is.not.empty(value)
  })
}
