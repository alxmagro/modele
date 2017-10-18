import { expect } from 'chai'
import Exclusion from '../../../../src/validator/rules/exclusion'
import Errors from '../../../../src/validator/errors'

describe('Exclusion', function () {
  var validator, errors

  beforeEach(function () {
    errors = new Errors()
  })

  describe('#constructor', function () {
    it('throw TypeError when "in" options isnt supplied', function () {
      const wrong = () => new Exclusion()

      expect(wrong).to.throw(TypeError)
    })
  })

  describe('.perform', function () {
    context('when "in" list is an array', function () {
      beforeEach(function () {
        validator = new Exclusion({
          in: ['www', 'us', 'ca', 'jp']
        })
      })

      it('add nothing when record property isnt included', function () {
        const record = { subdomain: 'br' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.any()).to.be.false
      })

      it('add error when record property is included', function () {
        const record = { subdomain: 'www' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.all()).to.deep.equal({
          subdomain: [
            {
              error: 'exclusion',
              ctx: {
                record: record,
                prop: 'subdomain',
                value: 'www',
                list: ['www', 'us', 'ca', 'jp']
              }
            }
          ]
        })
      })
    })

    context('when "in" list is a function', function () {
      beforeEach(function () {
        validator = new Exclusion({
          in: () => ['www', 'us', 'ca', 'jp']
        })
      })

      it('add nothing when record property isnt included', function () {
        const record = { subdomain: 'br' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.any()).to.be.false
      })

      it('add error when record property is included', function () {
        const record = { subdomain: 'www' }

        validator.perform(record, 'subdomain', errors)

        expect(errors.all()).to.deep.equal({
          subdomain: [
            {
              error: 'exclusion',
              ctx: {
                record: record,
                prop: 'subdomain',
                value: 'www',
                list: ['www', 'us', 'ca', 'jp']
              }
            }
          ]
        })
      })
    })
  })
})
