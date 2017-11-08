import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import length from '../../../../src/validation/rules/length'

describe('length', function () {
  var rule

  context('when "is" is suplied', function () {
    beforeEach(function () {
      rule = length({ is: 3 })
    })

    it('build a Rule', function () {
      expect(rule).to.be.an.instanceof(Rule)
    })

    it('return true if value.length == is', function () {
      expect(rule.test('foo')).to.be.true
    })

    it('return false if value.length != is', function () {
      expect(rule.test('foobar')).to.be.false
    })
  })

  context('when "min" and "max" is suplied', function () {
    beforeEach(function () {
      rule = length({ min: 3, max: 5 })
    })

    it('build a Rule', function () {
      expect(rule).to.be.an.instanceof(Rule)
    })

    it('return true if value.length between min and max', function () {
      expect(rule.test('foo')).to.be.true
    })

    it('return false if value.length < min', function () {
      expect(rule.test('no')).to.be.false
    })

    it('return false if value.length > max', function () {
      expect(rule.test('foobar')).to.be.false
    })
  })

  context('when "min" is suplied', function () {
    beforeEach(function () {
      rule = length({ min: 3 })
    })

    it('build a Rule', function () {
      expect(rule).to.be.an.instanceof(Rule)
    })

    it('return true if value.length >= min', function () {
      expect(rule.test('foobar')).to.be.true
    })

    it('return false if value.length < min', function () {
      expect(rule.test('no')).to.be.false
    })
  })

  context('when "max" is suplied', function () {
    beforeEach(function () {
      rule = length({ max: 5 })
    })

    it('build a Rule', function () {
      expect(rule).to.be.an.instanceof(Rule)
    })

    it('return true if value.length <= max', function () {
      expect(rule.test('foo')).to.be.true
    })

    it('return false if value.length > max', function () {
      expect(rule.test('foobar')).to.be.false
    })
  })
})
