import { expect } from 'chai'
import ExclusionRule from '../../../../src/validation/rules/exclusion'

describe('ExclusionRule', function () {
  var rule

  beforeEach(function () {
    rule = new ExclusionRule({ in: ['foo', 'bar'] })
  })

  describe('.test', function () {
    it('return false if list includes value', function () {
      expect(rule.test('foo')).to.be.false
    })

    it('return true if list excludes value', function () {
      expect(rule.test('baz')).to.be.true
    })

    it('accepts function as param', function () {
      rule = new ExclusionRule({ in: () => ['foo', 'bar'] })

      expect(rule.test('baz')).to.be.true
    })
  })
})
