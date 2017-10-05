import { expect } from 'chai'
import Confirmation from '../../../../src/validator/rules/confirmation'

describe('Confirmation', function () {
  describe('.perform', function () {
    var validator = new Confirmation({ with: 'confirmation' })

    it('throw type error if "with" isnt supplied', function () {
      const wrong = () => new Confirmation()

      expect(wrong).to.throw(TypeError)
    })

    it('return error if prop and confirmation doesnt match', function () {
      const record = { password: 'mypass', confirmation: 'mypss' }
      const report = validator.perform(record, 'password')

      expect(report).to.deep.equal({
        message: 'confirmation',
        vars: {
          prop: 'confirmation',
          referred: 'password',
          value: 'mypss'
        }
      })
    })

    context('when case sensitive', function () {
      it('return error if prop and confirmation case doesnt match', function () {
        const record = { password: 'mypass', confirmation: 'MYPASS' }
        const report = validator.perform(record, 'password')

        expect(report).to.deep.equal({
          message: 'confirmation',
          vars: {
            prop: 'confirmation',
            referred: 'password',
            value: 'MYPASS'
          }
        })
      })
    })

    context('when case insensitive', function () {
      it('return nothing if prop and confirmation match but no case', function () {
        validator.caseSensitive = false

        const record = { password: 'mypass', confirmation: 'MYPASS' }
        const report = validator.perform(record, 'password')

        expect(report).to.be.undefined
      })
    })
  })
})
