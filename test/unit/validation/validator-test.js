import { expect } from 'chai'
import Validator from '../../../src/validation/validator'

describe('Validator', function () {
  var validator

  beforeEach(function () {
    validator = new Validator({
      name: { presence: true },
      email: { presence: { on: 'create' }},
      password: { presence: { on: 'update' }}
    })
  })

  describe('#constructor', function () {
    it('set ruleset', function () {
      expect(validator.ruleset).to.have.all.keys(
        'absence',
        'acceptance',
        'confirmation',
        'date',
        'exclusion',
        'format',
        'future',
        'inclusion',
        'length',
        'past',
        'presence'
      )
    })
  })

  describe('.validateProp', function () {
    context('given record property with errors on scope', function () {
      it('returns an array contained errors', function () {
        const record = {}
        const errors = validator.validateProp(record, 'password', 'update')

        expect(errors).to.deep.equal([
          {
            name: 'presence',
            validator: 'modele',
            context: {
              on: 'update',
              record: record,
              prop: 'password',
              value: undefined
            }
          }
        ])
      })
    })

    context('given record property with no errors on scope', function () {
      it('returns an empty array', function () {
        const record = {}
        const errors = validator.validateProp(record, 'password', 'create')

        expect(errors).to.deep.equal([])
      })
    })

    context('given record property with error', function () {
      it('returns an array contained errors', function () {
        const record = {}
        const errors = validator.validateProp(record, 'name')

        expect(errors).to.deep.equal([
          {
            name: 'presence',
            validator: 'modele',
            context: {
              record: record,
              prop: 'name',
              value: undefined
            }
          }
        ])
      })
    })

    context('given record property with no errors', function () {
      it('returns an empty array', function () {
        const record = { name: 'Luke' }
        const errors = validator.validateProp(record, 'name')

        expect(errors).to.deep.equal([])
      })
    })
  })

  describe('.validate', function () {
    context('when given record has errors', function () {
      it('returns an object that maps property => errors', function () {
        const record = {}
        const errors = validator.validate(record, 'create')

        expect(errors).to.deep.equal({
          name: [
            {
              name: 'presence',
              validator: 'modele',
              context: {
                record: record,
                prop: 'name',
                value: undefined
              }
            }
          ],

          email: [
            {
              name: 'presence',
              validator: 'modele',
              context: {
                on: 'create',
                record: record,
                prop: 'email',
                value: undefined
              }
            }
          ],
          password: []
        })
      })
    })

    context('when given record has no errors', function () {
      it('return an object with empty properties', function () {
        const record = { name: 'Luke', email: 'luke@rebels.com' }
        const errors = validator.validate(record, 'create')

        expect(errors).to.deep.equal({
          email: [],
          name: [],
          password: []
        })
      })
    })
  })
})
