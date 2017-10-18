import { expect } from 'chai'
import Absence from '../../../../src/validator/rules/absence'
import Errors from '../../../../src/validator/errors'

describe('Absence', function () {
  var validator = new Absence()
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

  describe('.perform', function () {
    it('add error if prop is present', function () {
      const record = { name: 'luke' }

      validator.perform(record, 'name', errors)

      expect(errors.all()).to.deep.equal({
        name: [
          {
            error: 'present',
            ctx: {
              record: record,
              prop: 'name',
              value: 'luke'
            }
          }
        ]
      })
    })

    it('add nothing if prop isnt defined', function () {
      const record = { name: 'luke' }

      validator.perform(record, 'surname', errors)

      expect(errors.any()).to.be.false
    })
  })
})
