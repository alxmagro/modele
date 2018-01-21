import { expect } from 'chai'
import Presence from '../../../../src/validation/rules/presence'

describe('presence', function () {
  var rule

  beforeEach(function () {
    rule = new Presence()
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
