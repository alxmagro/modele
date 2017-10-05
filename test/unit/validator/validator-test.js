import { expect } from 'chai'
import Validator from '../../../src/validator/validator'

import Length from '../../../src/validator/rules/length'
import Presence from '../../../src/validator/rules/presence'

describe('Validator', function () {
  describe('#constructor', function () {
    it('set a default ruleBook', function () {
      const validator = new Validator()
      const keys = Object.keys(validator.ruleBook)

      expect(keys).to.deep.equal([
        'absence',
        'acceptance',
        'confirmation',
        'exclusion',
        'format',
        'inclusion',
        'length',
        'presence'
      ])
    })

    it('set a custom ruleBook if it is parametrized', function () {
      const ruleBook = { size: Length, exists: Presence }
      const validator = new Validator({ ruleBook })

      expect(validator).to.have.property('ruleBook', ruleBook)
    })

    it('set empty rules', function () {
      const validator = new Validator()

      expect(validator).to.have.deep.property('rules', {})
    })
  })

  describe('.addRule', function () {
    var validator

    beforeEach(function () {
      validator = new Validator()
    })

    it('throw TypeError if key is not defined', function () {
      const wrong = () => validator.addRule('size', 'name', { min: 8 })

      expect(wrong).to.throw(TypeError)
    })

    it('add new rule to an empty key', function () {
      validator.addRule('presence', 'username')

      expect(validator.rules).to.have.deep.property('username', [
        new Presence()
      ])
    })

    it('add new rule to an key with other rules', function () {
      validator.addRule('presence', 'username')
      validator.addRule('length', 'username', { min: 8 })

      expect(validator.rules).to.have.deep.property('username', [
        new Presence(),
        new Length({ min: 8 })
      ])
    })
  })

  describe('.validate', function () {
    var validator, record

    beforeEach(function () {
      validator = new Validator()

      record = { name: 'Luke', surname: 'Skywalker' }
    })

    it('return a error list if record is not correct', function () {
      validator.addRule('presence', 'username')
      validator.addRule('length', 'username', { min: 5 })

      const report = validator.validate(record, 'username')

      expect(report).to.deep.equal([
        {
          message: 'blank',
          vars: {
            prop: 'username',
            value: undefined
          }
        },
        {
          message: 'too_short',
          vars: {
            prop: 'username',
            expected: 5,
            value: undefined
          }
        }
      ])
    })

    it('return a empty list if record is correct', function () {
      record.username = 'lukeskywalker'

      validator.addRule('presence', 'username')
      validator.addRule('length', 'username', { min: 5 })

      const report = validator.validate(record, 'username')

      expect(report).to.deep.equal([])
    })
  })

  describe('.validateAll', function () {
    var validator = new Validator()

    it('return a error list of all props if record is not correct', function () {
      const record = { email: 'foo' }

      validator.addRule('presence', 'name')
      validator.addRule('length', 'name', { min: 3 })
      validator.addRule('length', 'email', { min: 5 })
      validator.addRule('confirmation', 'email', { with: 'confirmation' })

      const report = validator.validateAll(record)

      expect(report).to.deep.equal({
        name: [
          {
            message: 'blank',
            vars: {
              prop: 'name',
              value: undefined
            }
          },
          {
            message: 'too_short',
            vars: {
              prop: 'name',
              expected: 3,
              value: undefined
            }
          }
        ],
        confirmation: [
          {
            message: 'confirmation',
            vars: {
              prop: 'confirmation',
              referred: 'email',
              value: undefined
            }
          }
        ],
        email: [
          {
            message: 'too_short',
            vars: {
              prop: 'email',
              expected: 5,
              value: 'foo'
            }
          }
        ]
      })
    })

    it('return a empty list if record is correct', function () {
      const record = {
        name: 'luke',
        email: 'lukeskywalker@jedi.com',
        confirmation: 'lukeskywalker@jedi.com'
      }

      validator.addRule('presence', 'name')
      validator.addRule('length', 'name', { min: 3 })
      validator.addRule('length', 'email', { min: 5 })
      validator.addRule('confirmation', 'email', { with: 'confirmation' })

      const report = validator.validateAll(record)

      expect(report).to.deep.equal({})
    })
  })
})
