/* eslint-env jest */
import { past } from 'validations'

describe('past()', () => {
  let rule

  beforeEach(() => {
    rule = past()
  })

  describe('.name', () => {
    test('is "past"', () => {
      expect(rule.name).toBe('past')
    })
  })

  describe('.rule', () => {
    test('returns true when value is past', () => {
      var value = new Date()

      value.setDate(value.getDate() - 1)

      expect(rule.test(value)).toBe(true)
    })

    test('returns false when value is future', () => {
      var value = new Date()

      value.setDate(value.getDate() + 1)

      expect(rule.test(value)).toBe(false)
    })
  })
})
