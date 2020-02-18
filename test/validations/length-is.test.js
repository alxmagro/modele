/* eslint-env jest */
import { lengthIs } from 'validations'

describe('lengthIs(size)', () => {
  let rule

  beforeEach(() => {
    rule = lengthIs(3)
  })

  describe('.name', () => {
    test('is "lengthIs"', () => {
      expect(rule.name).toBe('lengthIs')
    })
  })

  describe('.test', () => {
    test('returns true to values with length equal to size', () => {
      expect(rule.test('123')).toBe(true)
    })

    test('returns false to values with length different to size', () => {
      expect(rule.test('12')).toBe(false)
      expect(rule.test('1234')).toBe(false)
    })
  })
})
