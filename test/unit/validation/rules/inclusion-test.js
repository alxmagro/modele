import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import inclusion from '../../../../src/validation/rules/inclusion'

describe('inclusion', function () {
  var rule

  beforeEach(function () {
    rule = inclusion({ in: ['foo', 'bar'] })
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return true if list includes value', function () {
    expect(rule.test('foo')).to.be.true
  })

  it('return false if list excludes value', function () {
    expect(rule.test('baz')).to.be.false
  })

  it('accepts function as param', function () {
    rule = inclusion({ in: () => ['foo', 'bar'] })

    expect(rule.test('foo')).to.be.true
  })
})
