import { expect } from 'chai'
import Acceptance from '../../../../src/validator/rules/acceptance'

describe('Acceptance', function () {
  describe('#constructor', function () {
    it('can receive an white-list', function () {
      var validator = new Acceptance({ accept: ['1', true, 'TRUE'] })

      expect(validator.accept).to.deep.equal(['1', true, 'TRUE'])
    })
  })

  describe('.perform', function () {
    var validator = new Acceptance()

    it('return error if value isnt in accept list', function () {
      const record = { name: 'luke' }
      const report = validator.perform(record, 'termsOfUse')

      expect(report).to.deep.equal({
        message: 'accepted',
        vars: {
          prop: 'termsOfUse',
          value: undefined,
          accept: ['1', true]
        }
      })
    })

    it('return null if prop isnt defined', function () {
      const record = { name: 'luke', termsOfUse: true }
      const report = validator.perform(record, 'termsOfUse')

      expect(report).to.equal(undefined)
    })
  })
})
