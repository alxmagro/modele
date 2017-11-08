import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import presence from '../../../../src/validation/rules/presence'

describe('presence', function () {
  var rule

  beforeEach(function () {
    rule = presence()
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return false if value is undefined', function () {
    expect(rule.test()).to.be.false
  })

  it('return false if value is null', function () {
    expect(rule.test(null)).to.be.false
  })

  it('return false if value is an empty string', function () {
    expect(rule.test('')).to.be.false
  })

  it('return false if value is an empty object', function () {
    expect(rule.test({})).to.be.false
  })

  it('return true if value is a non-empty object', function () {
    expect(rule.test('foo')).to.be.true
  })
})
