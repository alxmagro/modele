import { expect } from 'chai'
import PastRule from '../../../src/rules/past'

describe('PastRule', function () {
  var rule

  beforeEach(function () {
    rule = new PastRule()
  })

  describe('.test', function () {
    it('return true if value is past', function () {
      var value = new Date()

      value.setDate(value.getDate() - 1)

      expect(rule.test(value)).to.be.true
    })

    it('return false if value is future', function () {
      var value = new Date()

      value.setDate(value.getDate() + 1)

      expect(rule.test('foo')).to.be.false
    })
  })
})
