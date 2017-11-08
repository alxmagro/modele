import { Rule } from '../'

export default (obj) => {
  if (obj.with) {
    return new Rule({
      name: 'format',
      test: (value) => obj.with.test(value)
    })
  }

  throw new TypeError('Enter "with" option')
}
