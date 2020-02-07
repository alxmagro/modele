/* eslint-env jest */
import { confirmation } from 'validations'

describe('confirmation(other)', () => {
  let rule

  beforeEach(() => {
    rule = confirmation('name')
  })

  describe('.name', () => {
    test('is "confirmation"', () => {
      expect(rule.name).toBe('confirmation')
    })
  })

  describe('.rule', () => {
    test('returns true to values that is equal to other', () => {
      expect(rule.test('Joe', { name: 'Joe' })).toBe(true)
    })

    test('returns false to values that inst equal to other', () => {
      expect(rule.test('Joe', { name: 'Jane' })).toBe(false)
    })
  })
})
