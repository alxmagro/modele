import { expect } from 'chai'
import Presence from '../../../../src/validator/rules/presence'

describe('Presence', function () {
  var validator = new Presence()

  describe('.perform', function () {
    it('return error if prop is blank', function () {
      const record = { name: 'luke' }
      const report = validator.perform(record, 'surname')

      expect(report).to.deep.equal({
        message: 'blank',
        vars: { prop: 'surname', value: undefined }
      })
    })

    it('return nothing if prop is present', function () {
      const record = { name: 'luke' }
      const report = validator.perform(record, 'name')

      expect(report).to.equal(undefined)
    })
  })
})
