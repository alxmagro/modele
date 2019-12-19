/* eslint-env jest */
import { absence } from 'validations'

describe('absence()', () => {
  let rule

  beforeEach(() => {
    rule = absence()
  })

  describe('.name', () => {
    test('is "absence"', () => {
      expect(rule.name).toBe('absence')
    })
  })

  describe('.rule', () => {
    test('returns true to nulls, empty strings, arrays and objects', () => {
      expect(rule.test(null)).toBe(true)
      expect(rule.test('')).toBe(true)
      expect(rule.test([])).toBe(true)
      expect(rule.test({})).toBe(true)
    })

    test('returns false to bool, numbers, not empty string, arrays and objects', () => {
      expect(rule.test(true)).toBe(false)
      expect(rule.test(false)).toBe(false)
      expect(rule.test(1)).toBe(false)
      expect(rule.test(0)).toBe(false)
      expect(rule.test(-1)).toBe(false)
      expect(rule.test('a')).toBe(false)
      expect(rule.test([0])).toBe(false)
      expect(rule.test({ a: 0 })).toBe(false)
    })
  })
})
