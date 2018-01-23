import { expect } from 'chai'
import Rule from '../../../../src/validation/structures/rule'
import Validator from '../../../../src/validation/structures/validator'

describe('Validator', function () {
  var validator

  beforeEach(function () {
    validator = new Validator()
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

  describe('.setRules', function () {
    it('set rules', function () {
      validator.setRules({
        name: { presence: true },
        surname: { presence: true }
      })

      expect(validator.rules).to.have.all.keys('name', 'surname')
    })
  })

  describe('.buildRule', function () {
    it('return a Rule instance given a name and options', function () {
      const rule = validator.buildRule('presence', true)

      expect(rule).to.be.an.instanceOf(Rule).that.deep.include({
        name: 'presence',
        options: {}
      })
    })
  })

  describe('.validateProp', function () {
    context('given record property with errors on scope', function () {
      it('returns an array contained errors', function () {
        validator.setRules({
          name: { presence: true },
          password: { presence: { on: 'create' }}
        })

        const record = {}
        const errors = validator.validateProp(record, 'password', 'create')

        expect(errors).to.deep.equal([
          {
            name: 'presence',
            validator: 'modele',
            context: {
              on: 'create',
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
        validator.setRules({
          name: { presence: true },
          password: { presence: { on: 'create' }}
        })

        const record = {}
        const errors = validator.validateProp(record, 'password', 'update')

        expect(errors).to.deep.equal([])
      })
    })

    context('given record property with error', function () {
      it('returns an array contained errors', function () {
        validator.setRules({
          name: { presence: true }
        })

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
        validator.setRules({
          name: { presence: true }
        })

        const record = { name: 'Luke' }
        const errors = validator.validateProp(record, 'name')

        expect(errors).to.deep.equal([])
      })
    })
  })

  describe('.validate', function () {
    context('when given record has errors', function () {
      it('returns an object that maps property => errors', function () {
        validator.setRules({
          name: { presence: true },
          email: { presence: { on: 'create' }},
          password: { presence: { on: 'update' }}
        })

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
        validator.setRules({
          name: { presence: true },
          email: { presence: { on: 'create' }},
          password: { presence: { on: 'update' }}
        })

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
