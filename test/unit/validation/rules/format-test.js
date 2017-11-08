import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import format from '../../../../src/validation/rules/format'

describe('format', function () {
  var rule

  beforeEach(function () {
    rule = format({ with: /\d+/ })
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return true if regex match value', function () {
    expect(rule.test(42)).to.be.true
  })

  it('return false if regex match value', function () {
    expect(rule.test('foo')).to.be.false
  })
})
