import { expect } from 'chai'
import Exclusion from '../../../../src/validator/rules/exclusion'

describe('Exclusion', function () {
  describe('#constructor', function () {
    it('throw TypeError when "in" options isnt supplied', function () {
      const wrong = () => new Exclusion()

      expect(wrong).to.throw(TypeError)
    })
  })

  describe('.perform', function () {
    context('when "in" list is an array', function () {
      var validator = new Exclusion({
        in: ['www', 'us', 'ca', 'jp']
      })

      it('return nothing when "in" list not includes value', function () {
        const record = { subdomain: 'br' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.be.undefined
      })

      it('return error when "in" list includes value', function () {
        const record = { subdomain: 'www' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.deep.equal({
          message: 'exclusion',
          vars: {
            prop: 'subdomain',
            value: 'www',
            list: ['www', 'us', 'ca', 'jp']
          }
        })
      })
    })

    context('when "in" list is a function', function () {
      var validator = new Exclusion({
        in: () => ['www', 'us', 'ca', 'jp']
      })

      it('return nothing when "in" list not includes value', function () {
        const record = { subdomain: 'br' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.be.undefined
      })

      it('return error when "in" list includes value', function () {
        const record = { subdomain: 'www' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.deep.equal({
          message: 'exclusion',
          vars: {
            prop: 'subdomain',
            value: 'www',
            list: ['www', 'us', 'ca', 'jp']
          }
        })
      })
    })
  })
})
