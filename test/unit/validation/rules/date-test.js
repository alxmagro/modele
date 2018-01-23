import { expect } from 'chai'
import DateRule from '../../../../src/validation/rules/date'

describe('DateRule', function () {
  var rule

  describe('.test', function () {
    beforeEach(function () {
      var tomorrow = new Date(1879, 2, 15)
      var yesterday = new Date(1879, 2, 13)

      rule = new DateRule({ after: yesterday, before: tomorrow })
    })

    context('when "before" and "after" is supplied', function () {
      it('return true if value is between "before" and "after"', function () {
        var date = new Date(1879, 2, 14)

        expect(rule.test(date)).to.be.true
      })

      it('return false if value is before "after"', function () {
        var date = new Date(1879, 2, 10)

        expect(rule.test(date)).to.be.false

      })

      it('return false if value is after "before"', function () {
        var date = new Date(1879, 2, 20)

        expect(rule.test(date)).to.be.false
      })
    })

    context('when "before" is supplied', function () {
      beforeEach(function () {
        rule = new DateRule({ before: new Date(1879, 2, 14) })
      })

      it('return true if value is before "before"', function () {
        var date = new Date(1879, 2, 10)

        expect(rule.test(date)).to.be.true
      })

      it('return false if value is after "before"', function () {
        var date = new Date(1879, 2, 20)

        expect(rule.test(date)).to.be.false
      })
    })

    context('when "after" is supplied', function () {
      beforeEach(function () {
        rule = new DateRule({ after: new Date(1879, 2, 14) })
      })

      it('return true if value is after "after"', function () {
        var date = new Date(1879, 2, 20)

        expect(rule.test(date)).to.be.true
      })

      it('return false if value is before "after"', function () {
        var date = new Date(1879, 2, 10)

        expect(rule.test(date)).to.be.false
      })
    })
  })
})
