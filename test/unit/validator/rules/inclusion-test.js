import { expect } from 'chai'
import Inclusion from '../../../../src/validator/rules/inclusion'
import Errors from '../../../../src/validator/errors'

describe('Inclusion', function () {
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

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

      it('add nothing when record property is included', function () {
        const record = { subdomain: 'us' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.any()).to.be.false
      })

      it('add error when record property is not included', function () {
        const record = { subdomain: 'br' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.all()).to.deep.equal({
          subdomain: [
            {
              error: 'inclusion',
              ctx: {
                record: record,
                prop: 'subdomain',
                value: 'br',
                list: ['www', 'us', 'ca', 'jp']
              }
            }
          ]
        })
      })
    })

    context('when "in" list is a function', function () {
      var validator = new Inclusion({
        in: () => ['www', 'us', 'ca', 'jp']
      })

      it('add nothing when "in" list includes value', function () {
        const record = { subdomain: 'www' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.any()).to.be.false
      })

      it('add error when "in" list not includes value', function () {
        const record = { subdomain: 'br' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.all()).to.deep.equal({
          subdomain: [
            {
              error: 'inclusion',
              ctx: {
                record: record,
                prop: 'subdomain',
                value: 'br',
                list: ['www', 'us', 'ca', 'jp']
              }
            }
          ]
        })
      })
    })
  })
})
