import { expect } from 'chai'
import Confirmation from '../../../../src/validation/rules/confirmation'

describe('confirmation', function () {
  var rule

  beforeEach(function () {
    rule = new Confirmation({ with: 'second' })
  })

  it('return true if value is equal to record[with]', function () {
    expect(rule.test('foo', { second: 'foo' })).to.be.true
  })

  it('return false if value is not equal to record[with]', function () {
    expect(rule.test('foo', { second: 'bar' })).to.be.false
  })
})
