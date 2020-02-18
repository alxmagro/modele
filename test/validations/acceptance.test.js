/* eslint-env jest */
import { acceptance } from 'validations'

describe('acceptance()', () => {
  let rule

  beforeEach(() => {
    rule = acceptance()
  })

  describe('.name', () => {
    test('is "acceptance"', () => {
      expect(rule.name).toBe('acceptance')
    })
  })

  describe('.rule', () => {
    test('returns true to existents and not falsy values', () => {
      expect(rule.test(1)).toBe(true)
      expect(rule.test(-1)).toBe(true)
      expect(rule.test(true)).toBe(true)
      expect(rule.test([])).toBe(true)
      expect(rule.test({})).toBe(true)
    })

    test('returns false to non-existents or falsy values', () => {
      expect(rule.test(0)).toBe(false)
      expect(rule.test()).toBe(false)
      expect(rule.test(null)).toBe(false)
      expect(rule.test(false)).toBe(false)
    })
  })
})
