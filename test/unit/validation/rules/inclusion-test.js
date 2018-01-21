import { expect } from 'chai'
import Inclusion from '../../../../src/validation/rules/inclusion'

describe('inclusion', function () {
  var rule

  beforeEach(function () {
    rule = new Inclusion({ in: ['foo', 'bar'] })
  })

  it('return true if list includes value', function () {
    expect(rule.test('foo')).to.be.true
  })

  it('return false if list excludes value', function () {
    expect(rule.test('baz')).to.be.false
  })

  it('accepts function as param', function () {
    rule = new Inclusion({ in: () => ['foo', 'bar'] })

    expect(rule.test('foo')).to.be.true
  })
})
