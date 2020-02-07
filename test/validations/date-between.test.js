/* eslint-env jest */
import { dateBetween } from 'validations'

describe('dateBetween(start, end)', () => {
  let rule

  beforeEach(() => {
    const start = new Date('13 Mar 1879')
    const end = new Date('15 Mar 1879')

    rule = dateBetween(() => start, () => end)
  })

  describe('.name', () => {
    test('is "dateBetween"', () => {
      expect(rule.name).toBe('dateBetween')
    })
  })

  describe('.test', () => {
    test('returns true when between start and end', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when lower than start', () => {
      expect(rule.test(new Date('12 Mar 1879'))).toBe(false)
    })

    test('returns false when greater than end', () => {
      expect(rule.test(new Date('16 Mar 1879'))).toBe(false)
    })
  })
})
