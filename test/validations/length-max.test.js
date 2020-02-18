/* eslint-env jest */
import { lengthMax } from 'validations'

describe('lengthMax(max)', () => {
  let rule

  beforeEach(() => {
    rule = lengthMax(5)
  })

  describe('.name', () => {
    test('is "lengthMax"', () => {
      expect(rule.name).toBe('lengthMax')
    })
  })

  describe('.test', () => {
    test('returns true when length is lower or equal to max', () => {
      expect(rule.test('1234')).toBe(true)
      expect(rule.test('12345')).toBe(true)
    })

    test('returns false when length is greater than max', () => {
      expect(rule.test('123456')).toBe(false)
    })
  })
})
