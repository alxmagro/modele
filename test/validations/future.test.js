/* eslint-env jest */
import { future } from 'validations'

describe('future()', () => {
  let rule

  beforeEach(() => {
    rule = future()
  })

  describe('.name', () => {
    test('is "future"', () => {
      expect(rule.name).toBe('future')
    })
  })

  describe('.rule', () => {
    test('returns true when value is future', () => {
      var value = new Date()

      value.setDate(value.getDate() + 1)

      expect(rule.test(value)).toBe(true)
    })

    test('returns false when value is past', () => {
      var value = new Date()

      value.setDate(value.getDate() - 1)

      expect(rule.test(value)).toBe(false)
    })
  })
})
