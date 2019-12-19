/* eslint-env jest */
import { format } from 'validations'

describe('format()', () => {
  test('throws Error', () => {
    expect(() => format()).toThrowError(Error)
  })
})

describe('format({ with })', () => {
  let rule

  beforeEach(() => {
    rule = format({ with: /\d+/ })
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
