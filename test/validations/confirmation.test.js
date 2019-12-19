/* eslint-env jest */
import { confirmation } from 'validations'

describe('confirmation()', () => {
  test('throws Error', () => {
    expect(() => confirmation()).toThrowError(Error)
  })
})

describe('confirmation({ with })', () => {
  let rule

  beforeEach(() => {
    rule = confirmation({ with: 'name' })
  })

  describe('.name', () => {
    test('is "confirmation"', () => {
      expect(rule.name).toBe('confirmation')
    })
  })

  describe('.rule', () => {
    test('returns true to values that is equal to record[with]', () => {
      expect(rule.test('Joe', { name: 'Joe' })).toBe(true)
    })

    test('returns false to values that inst equal to record[with]', () => {
      expect(rule.test('Joe', { name: 'Jane' })).toBe(false)
    })
  })
})
