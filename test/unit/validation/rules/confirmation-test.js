import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import confirmation from '../../../../src/validation/rules/confirmation'

describe('confirmation', function () {
  var rule

  beforeEach(function () {
    rule = confirmation({ with: 'second' })
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return true if value is equal to record[with]', function () {
    expect(rule.test('foo', { second: 'foo' })).to.be.true
  })

  it('return false if value is not equal to record[with]', function () {
    expect(rule.test('foo', { second: 'bar' })).to.be.false
  })
})
