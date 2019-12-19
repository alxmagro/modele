/* eslint-env jest */
import { inclusion } from 'validations'

describe('inclusion()', () => {
  test('throws Error', () => {
    expect(() => inclusion()).toThrowError(Error)
  })
})

describe('inclusion({ in })', () => {
  let rule

  beforeEach(() => {
    rule = inclusion({ in: [1, 2, 3] })
  })

  describe('.name', () => {
    test('is "inclusion"', () => {
      expect(rule.name).toBe('inclusion')
    })
  })

  describe('.rule', () => {
    test('returns true when value is included', () => {
      expect(rule.test(1)).toBe(true)
    })

    test('returns false when value isnt included', () => {
      expect(rule.test(4)).toBe(false)
    })
  })
})
