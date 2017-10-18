import { expect } from 'chai'
import Presence from '../../../../src/validator/rules/presence'
import Errors from '../../../../src/validator/errors'

describe('Presence', function () {
  var validator = new Presence()
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

  describe('.perform', function () {
    it('add error if prop is blank', function () {
      const record = { name: 'luke' }

      validator.perform(record, 'surname', errors)

      expect(errors.all()).to.deep.equal({
        surname: [
          {
            error: 'blank',
            ctx: {
              record: record,
              prop: 'surname',
              value: undefined
            }
          }
        ]
      })
    })

    it('add nothing if prop is present', function () {
      const record = { name: 'luke' }

      validator.perform(record, 'name', errors)

      expect(errors.any()).to.be.false
    })
  })
})
