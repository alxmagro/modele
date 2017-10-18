import { expect } from 'chai'
import Acceptance from '../../../../src/validator/rules/acceptance'
import Errors from '../../../../src/validator/errors'

describe('Acceptance', function () {
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

  describe('#constructor', function () {
    it('can receive an white-list', function () {
      var validator = new Acceptance({ accept: ['1', true, 'TRUE'] })

      expect(validator.accept).to.deep.equal(['1', true, 'TRUE'])
    })
  })

  describe('.perform', function () {
    var validator = new Acceptance()

    it('add error if prop inst accepted', function () {
      const record = { name: 'luke' }

      validator.perform(record, 'termsOfUse', errors)

      expect(errors.all()).to.deep.equal({
        termsOfUse: [
          {
            error: 'accepted',
            ctx: {
              record: record,
              prop: 'termsOfUse',
              value: undefined,
              accept: ['1', true]
            }
          }
        ]
      })
    })

    it('add nothing if prop is accepted', function () {
      const record = { name: 'luke', termsOfUse: true }

      validator.perform(record, 'termsOfUse', errors)

      expect(errors.any()).to.be.false
    })
  })
})
