import { expect } from 'chai'
import Format from '../../../../src/validator/rules/format'
import Errors from '../../../../src/validator/errors'

describe('Format', function () {
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

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

      it('add nothing if value matches', function () {
        const record = { year: '1991' }

        validator.perform(record, 'year', errors)

        expect(errors.any()).to.be.false
      })

      it('add errors if value doesnt matches', function () {
        const record = { year: '1991a' }

        validator.perform(record, 'year', errors)

        expect(errors.all()).to.deep.equal({
          year: [
            {
              error: 'format',
              ctx: {
                record: record,
                prop: 'year',
                value: '1991a'
              }
            }
          ]
        })
      })
    })

    context('when "without" is supplied', function () {
      // cannot be only letters
      const validator = new Format({ without: /^\d+$/ })

      it('return nothing if value doesnt matches', function () {
        const record = { username: 'luke' }

        validator.perform(record, 'username', errors)

        expect(errors.any()).to.be.false
      })

      it('return errors if value matches', function () {
        const record = { username: '1991' }

        validator.perform(record, 'username', errors)

        expect(errors.all()).to.deep.equal({
          username: [
            {
              error: 'format',
              ctx: {
                record: record,
                prop: 'username',
                value: '1991'
              }
            }
          ]
        })
      })
    })
  })
})
