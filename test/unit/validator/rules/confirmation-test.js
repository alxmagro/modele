import { expect } from 'chai'
import Confirmation from '../../../../src/validator/rules/confirmation'
import Errors from '../../../../src/validator/errors'

describe('Confirmation', function () {
  describe('.perform', function () {
    var validator = new Confirmation({ with: 'confirmation' })
    var errors

    beforeEach(function () {
      errors = new Errors()
    })

    it('throw type error if "with" isnt supplied', function () {
      const wrong = () => new Confirmation()

      expect(wrong).to.throw(TypeError)
    })

    it('add error if prop and confirmation doesnt match', function () {
      const record = { password: 'mypass', confirmation: 'mypss' }

      validator.perform(record, 'password', errors)

      expect(errors.all()).to.deep.equal({
        confirmation: [
          {
            error: 'confirmation',
            ctx: {
              record: record,
              prop: 'confirmation',
              value: 'mypss',
              referred: 'password'
            }
          }
        ]
      })
    })

    context('when case sensitive', function () {
      it('add error if prop and confirmation case doesnt match', function () {
        const record = { password: 'mypass', confirmation: 'MYPASS' }

        validator.perform(record, 'password', errors)

        expect(errors.all()).to.deep.equal({
          confirmation: [
            {
              error: 'confirmation',
              ctx: {
                record: record,
                prop: 'confirmation',
                value: 'MYPASS',
                referred: 'password'
              }
            }
          ]
        })
      })
    })

    context('when case insensitive', function () {
      it('add nothing if prop and confirmation match but no case', function () {
        const record = { password: 'mypass', confirmation: 'MYPASS' }

        validator.caseSensitive = false
        validator.perform(record, 'password', errors)

        expect(errors.any()).to.be.false
      })
    })
  })
})
