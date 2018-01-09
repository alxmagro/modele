import { Rule, solved } from '../'
import is from 'is_js'

export default (obj) => {
  const format = obj.format
  const before = obj.before && solved(obj.before, format)
  const after = obj.after && solved(obj.after, format)

  if (before && after) {
    return new Rule({
      name: 'date_between',
      test: (value) => is.inDateRange(value, before, after),
      data: { before, after }
    })
  }

  if (before) {
    return new Rule({
      name: 'date_before',
      test: (value) => (obj.orSame) ? value <= before : value < before,
      data: { before }
    })
  }

  if (after) {
    return new Rule({
      name: 'date_after',
      test: (value) => (obj.orSame) ? value >= after : value > after,
      data: { after }
    })
  }

  throw new TypeError('Enter "before" and/or "after" option')
}
