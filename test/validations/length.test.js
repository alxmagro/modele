/* eslint-env jest */
import { length } from 'validations'

describe('length()', () => {
  test('throws Error', () => {
    expect(() => length()).toThrowError(Error)
  })
})

describe('length({ is })', () => {
  let rule

  beforeEach(() => {
    rule = length({ is: 3 })
  })

  describe('.name', () => {
    test('is "length"', () => {
      expect(rule.name).toBe('length')
    })
  })

  describe('.test', () => {
    test('returns true to values with length equal to "is"', () => {
      expect(rule.test('123')).toBe(true)
    })

    test('returns false to values with length different to "is"', () => {
      expect(rule.test('12')).toBe(false)
      expect(rule.test('1234')).toBe(false)
    })
  })
})

describe('length({ min, max })', () => {
  let rule

  beforeEach(() => {
    rule = length({ min: 3, max: 5 })
  })

  describe('.name', () => {
    test('is "length_between"', () => {
      expect(rule.name).toBe('length_between')
    })
  })

  describe('.test', () => {
    test('returns true when length is between [min..max]', () => {
      expect(rule.test('123')).toBe(true)
      expect(rule.test('1234')).toBe(true)
      expect(rule.test('12345')).toBe(true)
    })

    test('returns false when length is lower than min', () => {
      expect(rule.test('12')).toBe(false)
    })

    test('returns false when length is greater than max', () => {
      expect(rule.test('123456')).toBe(false)
    })
  })
})

describe('length({ min })', () => {
  let rule

  beforeEach(() => {
    rule = length({ min: 3 })
  })

  describe('.name', () => {
    test('is "length_min"', () => {
      expect(rule.name).toBe('length_min')
    })
  })

  describe('.test', () => {
    test('returns true when length is greater or equal to min', () => {
      expect(rule.test('123')).toBe(true)
      expect(rule.test('1234')).toBe(true)
    })

    test('returns false when length is lower than min', () => {
      expect(rule.test('12')).toBe(false)
    })
  })
})

describe('length({ max })', () => {
  let rule

  beforeEach(() => {
    rule = length({ max: 5 })
  })

  describe('.name', () => {
    test('is "length_max"', () => {
      expect(rule.name).toBe('length_max')
    })
  })

  describe('.test', () => {
    test('returns true when length is lower or equal to max', () => {
      expect(rule.test('1234')).toBe(true)
      expect(rule.test('12345')).toBe(true)
    })

    test('returns false when length is greater than max', () => {
      expect(rule.test('123456')).toBe(false)
    })
  })
})
