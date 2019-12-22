/* eslint-env jest */
import Errors from 'core/errors'

describe('Errors', () => {
  let errors

  beforeEach(() => {
    errors = new Errors(['name', 'surname'])
  })

  describe('#constructor', () => {
    test('set no items when no parameter is given', () => {
      const other = new Errors()

      expect(other.items).toEqual({})
    })

    test('set items as empty lists', () => {
      expect(errors.items.name).toEqual([])
      expect(errors.items.surname).toEqual([])
    })
  })

  describe('.add', () => {
    test('add error to items[property]', () => {
      errors.add('name', 'presence')

      expect(errors.items.name).toContain('presence')
    })
  })

  describe('.any', () => {
    test('returns true when has errors', () => {
      errors.add('name', 'presence')

      expect(errors.any()).toBe(true)
    })

    test('returns false when has no errors', () => {
      expect(errors.any()).toBe(false)
    })

    test('returns true when has errors into items[prop]', () => {
      errors.add('name', 'presence')

      expect(errors.any('name')).toBe(true)
    })

    test('returns false when has no errors into items[prop]', () => {
      errors.add('surname', 'presence')

      expect(errors.any('name')).toBe(false)
    })
  })

  describe('.clear', () => {
    test('empty all error lists', () => {
      errors.add('name', 'presence')
      errors.add('name', 'presence')
      errors.clear()

      expect(errors.items.name).toEqual([])
      expect(errors.items.surname).toEqual([])
    })
  })

  describe('.empty', () => {
    test('returns true when has no errors', () => {
      expect(errors.empty()).toBe(true)
    })

    test('returns false when has errors', () => {
      errors.add('name', 'presence')

      expect(errors.empty()).toBe(false)
    })

    test('returns true when has no errors into items[prop]', () => {
      errors.add('surname', 'presence')

      expect(errors.empty('name')).toBe(true)
    })

    test('returns false when has errors into items[prop]', () => {
      errors.add('name', 'presence')

      expect(errors.empty('name')).toBe(false)
    })
  })

  describe('.set', () => {
    test('set items[prop]', () => {
      errors.set('name', ['presence', 'length'])

      expect(errors.items.name).toEqual(['presence', 'length'])
    })
  })
})
