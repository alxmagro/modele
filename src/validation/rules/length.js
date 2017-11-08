import { Rule } from '../'

export default (obj) => {
  if (obj.is) {
    return new Rule({
      name: 'length',
      test: (value) => value.length === obj.is,
      data: obj
    })
  }

  if (obj.min) {
    if (obj.max) {
      return new Rule({
        name: 'length_between',
        test: (value) => value.length <= obj.max && value.length >= obj.min,
        data: obj
      })
    } else {
      return new Rule({
        name: 'length_min',
        test: (value) => value.length >= obj.min,
        data: obj
      })
    }
  }

  if (obj.max) {
    return new Rule({
      name: 'length_max',
      test: (value) => value.length <= obj.max,
      data: obj
    })
  }

  return new TypeError('Supply options "is", "min" and/or "max"')
}
