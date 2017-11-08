import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import acceptance from '../../../../src/validation/rules/acceptance'

describe('acceptance', function () {
  var rule

  beforeEach(function () {
    rule = acceptance()
  })

  it('build a Rule', function () {
    expect(rule).to.be.an.instanceof(Rule)
  })

  it('return false if value not exists', function () {
    expect(rule.test()).to.be.false
  })

  it('return false if value is false', function () {
    expect(rule.test(false)).to.be.false
  })

  it('return true if value is true', function () {
    expect(rule.test(true)).to.be.true
  })
})
