import { expect } from 'chai'
import Length from '../../../../src/validator/rules/length'
import Errors from '../../../../src/validator/errors'

describe('Length', function () {
  var errors

  beforeEach(function () {
    errors = new Errors()
  })

  describe('.perform', function () {
    context('when "is" option is supplied', function () {
      var validator = new Length({ is: 4 })

      it('add nothing if value length === expected', function () {
        const record = { name: 'Luke' }

        validator.perform(record, 'name', errors)

        expect(errors.any()).to.be.false
      })

      it('add error if value length !== expected', function () {
        const record = { name: 'Anakin' }

        validator.perform(record, 'name', errors)

        expect(errors.all()).to.deep.equal({
          name: [
            {
              error: 'wrong_length',
              ctx: {
                record: record,
                prop: 'name',
                expected: 4,
                value: 'Anakin'
              }
            }
          ]
        })
      })
    })

    context('when "min" option is supplied', function () {
      var validator = new Length({ min: 4 })

      it('add nothing if value length > expected', function () {
        const record = { name: 'Anakin' }

        validator.perform(record, 'name', errors)

        expect(errors.any()).to.be.false
      })

      it('add nothing if value length == expected', function () {
        const record = { name: 'Luke' }

        validator.perform(record, 'name', errors)

        expect(errors.any()).to.be.false
      })

      it('add error if value length < than expected', function () {
        const record = { name: 'Rey' }

        validator.perform(record, 'name', errors)

        expect(errors.all()).to.deep.equal({
          name: [
            {
              error: 'too_short',
              ctx: {
                record: record,
                prop: 'name',
                value: 'Rey',
                expected: 4
              }
            }
          ]
        })
      })
    })

    context('when "max" option is supplied', function () {
      var validator = new Length({ max: 5 })

      it('add nothing if value length < expected', function () {
        const record = { name: 'Finn' }

        validator.validate(record, 'name', errors)

        expect(errors.any()).to.be.false
      })

      it('add nothing if value length == expected', function () {
        const record = { name: 'Snoke' }

        validator.perform(record, 'name', errors)

        expect(errors.any()).to.be.false
      })

      it('add error if value length > expected', function () {
        const record = { name: 'Chewbacca' }

        validator.perform(record, 'name', errors)

        expect(errors.all()).to.deep.equal({
          name: [
            {
              error: 'too_long',
              ctx: {
                record: record,
                prop: 'name',
                value: 'Chewbacca',
                expected: 5
              }
            }
          ]
        })
      })
    })
  })
})
