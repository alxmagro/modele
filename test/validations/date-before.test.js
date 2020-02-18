/* eslint-env jest */
import { dateBefore } from 'validations'

describe('dateBefore(end)', () => {
  let rule

  beforeEach(() => {
    const end = new Date('15 Mar 1879')

    rule = dateBefore(() => end)
  })

  describe('.name', () => {
    test('is "dateBefore"', () => {
      expect(rule.name).toBe('dateBefore')
    })
  })

  describe('.test', () => {
    test('returns true when lower than end', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when greater than end', () => {
      expect(rule.test(new Date('16 Mar 1879'))).toBe(false)
    })
  })
})
