/* eslint-env jest */
import { presence } from 'validations'

describe('presence()', () => {
  let rule

  beforeEach(() => {
    rule = presence()
  })

  describe('.name', () => {
    test('is "presence"', () => {
      expect(rule.name).toBe('presence')
    })
  })

  describe('.rule', () => {
    test('returns true to bool, numbers, not empty string, arrays and objects', () => {
      expect(rule.test(true)).toBe(true)
      expect(rule.test(false)).toBe(true)
      expect(rule.test(1)).toBe(true)
      expect(rule.test(0)).toBe(true)
      expect(rule.test(-1)).toBe(true)
      expect(rule.test('a')).toBe(true)
      expect(rule.test([0])).toBe(true)
      expect(rule.test({ a: 0 })).toBe(true)
    })

    test('returns false to nulls, empty strings, arrays and objects', () => {
      expect(rule.test(null)).toBe(false)
      expect(rule.test('')).toBe(false)
      expect(rule.test([])).toBe(false)
      expect(rule.test({})).toBe(false)
    })
  })
})
