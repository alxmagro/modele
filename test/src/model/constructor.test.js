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

    test('sets non-enumerable properties', () => {
      const hasProperty = (object, prop) => Object
        .prototype
        .hasOwnProperty
        .call(object, prop)

      const isEnumerable = (object, prop) => Object
        .prototype
        .propertyIsEnumerable
        .call(object, prop)

      expect(hasProperty(model, '$errors')).toBe(true)
      expect(hasProperty(model, '$pending')).toBe(true)
      expect(hasProperty(model, '$validations')).toBe(true)
      expect(isEnumerable(model, '$errors')).toBe(false)
      expect(isEnumerable(model, '$pending')).toBe(false)
      expect(isEnumerable(model, '$validations')).toBe(false)
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
