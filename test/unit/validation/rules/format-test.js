import { expect } from 'chai'
import FormatRule from '../../../../src/validation/rules/format'

describe('FormatRule', function () {
  var rule

  beforeEach(function () {
    rule = new FormatRule({ with: /\d+/ })
  })

  describe('.test', function () {
    it('return true if regex match value', function () {
      expect(rule.test(42)).to.be.true
    })

    it('return false if regex match value', function () {
      expect(rule.test('foo')).to.be.false
    })
  })
})
