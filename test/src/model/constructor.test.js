/* eslint-env jest */

// sources
import Model from 'core/model'

// helpers
import User from 'helpers/models/user'

describe('Model Constructor', () => {
  describe('#constructor', () => {
    const model = new User({ name: 'Joe', surname: 'Doe' })

    test('assign attributes to instance', () => {
      expect(model.name).toBe('Joe')
      expect(model.surname).toBe('Doe')
    })

    test('sets private properties', () => {
      expect(model).toHaveProperty('$errors')
      expect(model).toHaveProperty('$pending')
      expect(model).toHaveProperty('$rules')
    })
  })

  describe('#options', () => {
    test('returns default options', () => {
      const options = Model.options()

      expect(options).toHaveProperty('baseURL')
      expect(options).toHaveProperty('verbs')
    })
  })

  describe('#mutations', () => {
    test('returns empty object as default mutations', () => {
      expect(Model.mutations()).toEqual({})
    })
  })

  describe('#request', () => {
    test('throws error to warning this should be overridden', () => {
      expect(Model.request).toThrowError()
    })
  })

  describe('#validation', () => {
    test('returns empty object as default validation', () => {
      expect(Model.validation()).toEqual({})
    })
  })
})
