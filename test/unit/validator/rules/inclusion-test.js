import { expect } from 'chai'
import Inclusion from '../../../../src/validator/rules/inclusion'

describe('Inclusion', function () {
  describe('#constructor', function () {
    it('throw TypeError when "in" options isnt supplied', function () {
      const wrong = () => new Inclusion()

      expect(wrong).to.throw(TypeError)
    })
  })

  describe('.perform', function () {
    context('when "in" list is an array', function () {
      var validator = new Inclusion({
        in: ['www', 'us', 'ca', 'jp']
      })

      it('return nothing when "in" list includes value', function () {
        const record = { subdomain: 'us' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.be.undefined
      })

      it('return error when "in" list not includes value', function () {
        const record = { subdomain: 'br' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.deep.equal({
          message: 'inclusion',
          vars: {
            prop: 'subdomain',
            value: 'br',
            list: ['www', 'us', 'ca', 'jp']
          }
        })
      })
    })

    context('when "in" list is a function', function () {
      var validator = new Inclusion({
        in: () => ['www', 'us', 'ca', 'jp']
      })

      it('return nothing when "in" list includes value', function () {
        const record = { subdomain: 'www' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.be.undefined
      })

      it('return error when "in" list not includes value', function () {
        const record = { subdomain: 'br' }
        const report = validator.validate(record, 'subdomain')

        expect(report).to.deep.equal({
          message: 'inclusion',
          vars: {
            prop: 'subdomain',
            value: 'br',
            list: ['www', 'us', 'ca', 'jp']
          }
        })
      })
    })
  })
})
