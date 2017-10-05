import { expect } from 'chai'
import Absence from '../../../../src/validator/rules/absence'

describe('Absence', function () {
  var validator = new Absence()

  describe('.perform', function () {
    it('return error if prop is present', function () {
      const record = { name: 'luke' }
      const report = validator.perform(record, 'name')

      expect(report).to.deep.equal({
        message: 'present',
        vars: { prop: 'name', value: 'luke' }
      })
    })

    it('return nothing if prop isnt defined', function () {
      const record = { name: 'luke' }
      const report = validator.perform(record, 'surname')

      expect(report).to.equal(undefined)
    })
  })
})
