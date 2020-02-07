/* eslint-env jest */
import { lengthMin } from 'validations'

describe('lengthMin(min)', () => {
  let rule

  beforeEach(() => {
    rule = lengthMin(3)
  })

  describe('.name', () => {
    test('is "lengthMin"', () => {
      expect(rule.name).toBe('lengthMin')
    })
  })

  describe('.test', () => {
    test('returns true when length is greater or equal to min', () => {
      expect(rule.test('123')).toBe(true)
      expect(rule.test('1234')).toBe(true)
    })

    test('returns false when length is lower than min', () => {
      expect(rule.test('12')).toBe(false)
    })
  })
})
