import { Rule } from '../'
import is from 'is_js'

export default () => {
  return new Rule({
    name: 'absence',
    test: (value) => is.not.existy(value) || is.empty(value)
  })
}
