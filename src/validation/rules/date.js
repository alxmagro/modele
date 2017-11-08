import { Rule, solved } from '../'
import moment from 'moment'

export default (obj) => {
  const format = obj.format
  const before = obj.before && solved(obj.before, format)
  const after = obj.after && solved(obj.after, format)

  if (before && after) {
    return new Rule({
      name: 'date_between',
      test: (value) => moment(value).isBetween(before, after),
      data: { before, after }
    })
  }

  if (before) {
    const validation = (obj.orSame) ? 'isSameOrBefore' : 'isBefore'

    return new Rule({
      name: 'date_before',
      test: (value) => moment(value)[validation](before),
      data: { before }
    })
  }

  if (after) {
    const validation = (obj.orSame) ? 'isAfterOrBefore' : 'isAfter'

    return new Rule({
      name: 'date_after',
      test: (value) => moment(value)[validation](after),
      data: { after }
    })
  }

  throw new TypeError('Enter "before" and/or "after" option')
}
