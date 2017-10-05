import { expect } from 'chai'
import Length from '../../../../src/validator/rules/length'

describe('Length', function () {
  describe('.perform', function () {
    context('when "is" option is supplied', function () {
      var validator = new Length({ is: 4 })

      it('return nothing if value length === expected', function () {
        const record = { name: 'Luke' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([])
      })

      it('return error if value length !== expected', function () {
        const record = { name: 'Anakin' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([
          {
            message: 'wrong_length',
            vars: {
              prop: 'name',
              expected: 4,
              value: 'Anakin'
            }
          }
        ])
      })
    })

    context('when "min" option is supplied', function () {
      var validator = new Length({ min: 4 })

      it('return nothing if value length > expected', function () {
        const record = { name: 'Anakin' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([])
      })

      it('return nothing if value length == expected', function () {
        const record = { name: 'Luke' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([])
      })

      it('return error if value length < than expected', function () {
        const record = { name: 'Rey' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([
          {
            message: 'too_short',
            vars: {
              prop: 'name',
              expected: 4,
              value: 'Rey'
            }
          }
        ])
      })
    })

    context('when "max" option is supplied', function () {
      var validator = new Length({ max: 5 })

      it('return nothing if value length < expected', function () {
        const record = { name: 'Finn' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([])
      })

      it('return nothing if value length == expected', function () {
        const record = { name: 'Snoke' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([])
      })

      it('return error if value length > expected', function () {
        const record = { name: 'Chewbacca' }
        const report = validator.validate(record, 'name')

        expect(report).to.deep.equal([
          {
            message: 'too_long',
            vars: {
              prop: 'name',
              expected: 5,
              value: 'Chewbacca'
            }
          }
        ])
      })
    })
  })
})
