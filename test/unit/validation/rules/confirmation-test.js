import { expect } from 'chai'
import ConfirmationRule from '../../../../src/validation/rules/confirmation'

describe('ConfirmationRule', function () {
  var rule

  beforeEach(function () {
    rule = new ConfirmationRule({ with: 'second' })
  })

  it('return true if value is equal to record[with]', function () {
    expect(rule.test('foo', { second: 'foo' })).to.be.true
  })

  it('return false if value is not equal to record[with]', function () {
    expect(rule.test('foo', { second: 'bar' })).to.be.false
  })
})
