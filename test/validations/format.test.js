/* eslint-env jest */
import { format } from 'validations'

describe('format(regexp)', () => {
  let rule

  beforeEach(() => {
    rule = format(/\d+/)
  })

  describe('.name', () => {
    test('is "format"', () => {
      expect(rule.name).toBe('format')
    })
  })

  describe('.rule', () => {
    test('returns true when value matches', () => {
      expect(rule.test(42)).toBe(true)
    })

    test('returns false when value not matches', () => {
      expect(rule.test('Joe')).toBe(false)
    })
  })
})
