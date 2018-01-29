import { expect } from 'chai'
import AbsenceRule from '../../../src/rules/absence'

describe('AbsenceRule', function () {
  var rule

  beforeEach(function () {
    rule = new AbsenceRule()
  })

  describe('.test', function () {
    it('return true if value is undefined', function () {
      expect(rule.test()).to.be.true
    })

    it('return true if value is null', function () {
      expect(rule.test(null)).to.be.true
    })

    it('return true if value is an empty string', function () {
      expect(rule.test('')).to.be.true
    })

    it('return true if value is an empty object', function () {
      expect(rule.test({})).to.be.true
    })

    it('return false if value is a non-empty object', function () {
      expect(rule.test('foo')).to.be.false
    })
  })
})
