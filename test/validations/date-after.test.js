/* eslint-env jest */
import { dateAfter } from 'validations'

describe('dateAfter(start)', () => {
  let rule

  beforeEach(() => {
    const start = new Date('13 Mar 1879')

    rule = dateAfter(() => start)
  })

  describe('.name', () => {
    test('is "dateAfter"', () => {
      expect(rule.name).toBe('dateAfter')
    })
  })

  describe('.test', () => {
    test('returns true when greater than start', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when lower than start', () => {
      expect(rule.test(new Date('12 Mar 1879'))).toBe(false)
    })
  })
})
