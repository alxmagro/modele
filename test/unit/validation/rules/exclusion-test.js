import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import exclusion from '../../../../src/validation/rules/exclusion'

describe('exclusion', function () {
  var rule

  beforeEach(function () {
    rule = exclusion({ in: ['foo', 'bar'] })
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return false if list includes value', function () {
    expect(rule.test('foo')).to.be.false
  })

  it('return true if list excludes value', function () {
    expect(rule.test('baz')).to.be.true
  })

  it('accepts function as param', function () {
    rule = exclusion({ in: () => ['foo', 'bar'] })

    expect(rule.test('baz')).to.be.true
  })
})
