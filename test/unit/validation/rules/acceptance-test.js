import { expect } from 'chai'
import AcceptanceRule from '../../../../src/validation/rules/acceptance'

describe('AcceptanceRule', function () {
  var rule

  beforeEach(function () {
    rule = new AcceptanceRule()
  })

  describe('.test', function () {
    it('return false if value not exists', function () {
      expect(rule.test()).to.be.false
    })

    it('return false if value is false', function () {
      expect(rule.test(false)).to.be.false
    })

    it('return true if value is true', function () {
      expect(rule.test(true)).to.be.true
    })
  })
})
