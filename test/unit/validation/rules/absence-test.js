import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import absence from '../../../../src/validation/rules/absence'

describe('absence', function () {
  var rule

  beforeEach(function () {
    rule = absence()
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

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
