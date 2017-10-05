import { expect } from 'chai'
import Format from '../../../../src/validator/rules/format'

describe('Format', function () {
  describe('#constructor', function () {
    it('throw TypeError when both "with" and "without" is supplied', function () {
      const wrong = () => new Format({ with: /^\d+$/, without: /^\d+$/ })

      expect(wrong).to.throw(TypeError)
    })

    it('throw TypeError when both "with" and "without" isnt supplied', function () {
      const wrong = () => new Format()

      expect(wrong).to.throw(TypeError)
    })
  })

  describe('.perform', function () {
    context('when "with" is supplied', function () {
      // only numbers
      const validator = new Format({ with: /^\d+$/ })

      it('return nothing if value matches', function () {
        const record = { year: '1991' }
        const report = validator.validate(record, 'year')

        expect(report).to.be.undefined
      })

      it('return errors if value doesnt matches', function () {
        const record = { year: '1991a' }
        const report = validator.validate(record, 'year')

        expect(report).to.deep.equal({
          message: 'format',
          vars: {
            prop: 'year',
            value: '1991a'
          }
        })
      })
    })

    context('when "without" is supplied', function () {
      // cannot be only letters
      const validator = new Format({ without: /^\d+$/ })

      it('return nothing if value doesnt matches', function () {
        const record = { username: 'luke' }
        const report = validator.validate(record, 'username')

        expect(report).to.be.undefined
      })

      it('return errors if value matches', function () {
        const record = { username: '1991' }
        const report = validator.validate(record, 'username')

        expect(report).to.deep.equal({
          message: 'format',
          vars: {
            prop: 'username',
            value: '1991'
          }
        })
      })
    })
  })
})
