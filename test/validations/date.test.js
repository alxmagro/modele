/* eslint-env jest */
import { date } from 'validations'

describe('date()', () => {
  test('throws Error', () => {
    expect(() => date()).toThrowError(Error)
  })
})

describe('date({ before, after })', () => {
  let rule

  beforeEach(() => {
    const start = new Date('13 Mar 1879')
    const end = new Date('15 Mar 1879')

    rule = date({ after: () => start, before: () => end })
  })

  describe('.name', () => {
    test('is "date_between"', () => {
      expect(rule.name).toBe('date_between')
    })
  })

  describe('.test', () => {
    test('returns true when between [before...after]', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when lower than after', () => {
      expect(rule.test(new Date('12 Mar 1879'))).toBe(false)
    })

    test('returns false when greater than before', () => {
      expect(rule.test(new Date('16 Mar 1879'))).toBe(false)
    })
  })
})

describe('date({ before })', () => {
  let rule

  beforeEach(() => {
    const end = new Date('15 Mar 1879')

    rule = date({ before: () => end })
  })

  describe('.name', () => {
    test('is "date_before"', () => {
      expect(rule.name).toBe('date_before')
    })
  })

  describe('.test', () => {
    test('returns true when lower than before', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when greater than before', () => {
      expect(rule.test(new Date('16 Mar 1879'))).toBe(false)
    })
  })
})

describe('date({ after })', () => {
  let rule

  beforeEach(() => {
    const start = new Date('13 Mar 1879')

    rule = date({ after: () => start })
  })

  describe('.name', () => {
    test('is "date_after"', () => {
      expect(rule.name).toBe('date_after')
    })
  })

  describe('.test', () => {
    test('returns true when greater than after', () => {
      expect(rule.test(new Date('14 Mar 1879'))).toBe(true)
    })

    test('returns false when lower than after', () => {
      expect(rule.test(new Date('12 Mar 1879'))).toBe(false)
    })
  })
})
