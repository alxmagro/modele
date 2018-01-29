import { expect } from 'chai'
import InclusionRule from '../../../src/rules/inclusion'

describe('InclusionRule', function () {
  var rule

  beforeEach(function () {
    rule = new InclusionRule({ in: ['foo', 'bar'] })
  })

  describe('.test', function () {
    it('return true if list includes value', function () {
      expect(rule.test('foo')).to.be.true
    })

    it('return false if list excludes value', function () {
      expect(rule.test('baz')).to.be.false
    })

    it('accepts function as param', function () {
      rule = new InclusionRule({ in: () => ['foo', 'bar'] })

      expect(rule.test('foo')).to.be.true
    })
  })
})
