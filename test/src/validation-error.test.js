/* eslint-env jest */
import Model from 'core/model'
import ValidationError from 'core/validation-error'

describe('ValidationError', () => {
  let error, model

  beforeEach(() => {
    model = new Model({ name: 'Joe', surname: 'Doe' })
    error = new ValidationError(model)
  })

  describe('#constructor', () => {
    test('set model', () => {
      expect(error.model).toBe(model)
    })
  })
})
