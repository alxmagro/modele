/* eslint-env jest */
import { lengthBetween } from 'validations'

describe('lengthBetween(min, max)', () => {
  let rule

  beforeEach(() => {
    rule = lengthBetween(3, 5)
  })

  describe('.name', () => {
    test('is "lengthBetween"', () => {
      expect(rule.name).toBe('lengthBetween')
    })
  })

  describe('.test', () => {
    test('returns true when length is between min and max', () => {
      expect(rule.test('123')).toBe(true)
      expect(rule.test('1234')).toBe(true)
      expect(rule.test('12345')).toBe(true)
    })

    test('returns false when length is lower than min', () => {
      expect(rule.test('12')).toBe(false)
    })

    test('returns false when length is greater than max', () => {
      expect(rule.test('123456')).toBe(false)
    })
  })
})
