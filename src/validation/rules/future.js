import { Rule } from '../'
import is from 'is_js'

export default () => {
  return new Rule({
    name: 'future',
    test: (value) => is.future(value)
  })
}
