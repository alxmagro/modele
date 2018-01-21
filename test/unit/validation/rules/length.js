import { expect } from 'chai'
import Length from '../../../../src/validation/rules/length'

describe('length', function () {
  var rule

  context('when "is" is suplied', function () {
    beforeEach(function () {
      rule = new Length({ is: 3 })
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
      rule = new Length({ min: 3, max: 5 })
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
      rule = new Length({ min: 3 })
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
      rule = new Length({ max: 5 })
    })

    it('return true if value.length <= max', function () {
      expect(rule.test('foo')).to.be.true
    })

    it('return false if value.length > max', function () {
      expect(rule.test('foobar')).to.be.false
    })
  })
})
