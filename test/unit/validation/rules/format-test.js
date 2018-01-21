import { expect } from 'chai'
import Format from '../../../../src/validation/rules/format'

describe('format', function () {
  var rule

  beforeEach(function () {
    rule = new Format({ with: /\d+/ })
  })

  it('return true if regex match value', function () {
    expect(rule.test(42)).to.be.true
  })

  it('return false if regex match value', function () {
    expect(rule.test('foo')).to.be.false
  })
})
