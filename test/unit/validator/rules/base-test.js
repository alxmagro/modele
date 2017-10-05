import { expect } from 'chai'
import Base from '../../../../src/validator/rules/base'

describe('Base', function () {
  var blankTests = [
    { value: undefined, blank: true },
    { value: null, blank: true },
    { value: NaN, blank: true },
    { value: '', blank: true },
    { value: '  ', blank: true },
    { value: ' a ', blank: false },
    { value: () => {}, blank: false },
    { value: false, blank: false },
    { value: true, blank: false },
    { value: 0, blank: false },
    { value: 1, blank: false },
    { value: 2, blank: false }
  ]

  describe('#isBlank', function () {
    blankTests.forEach(test => {
      it(`return ${test.blank} when value is "${test.value}"`, function () {
        const res = Base.isBlank(test.value)

        expect(res).to.equal(test.blank)
      })
    })
  })

  describe('#isPresent', function () {
    blankTests.forEach(test => {
      it(`return ${!test.blank} when value is "${test.value}"`, function () {
        const res = Base.isPresent(test.value)

        expect(res).to.equal(!test.blank)
      })
    })
  })

  describe('.elegible', function () {
    it('return true when condition is not defined', function () {
      const base = new Base()

      expect(base.elegible()).to.be.true
    })

    it('return true when condition is a function and return true', function () {
      const base = new Base({ if: () => true })

      expect(base.elegible()).to.be.true
    })

    it('return true when condition is true', function () {
      const base = new Base({ if: true })

      expect(base.elegible()).to.be.true
    })

    it('return false when condition is a function and return false', function () {
      const base = new Base({ if: () => false })

      expect(base.elegible()).to.be.false
    })

    it('return false when condition is false', function () {
      const base = new Base({ if: false })

      expect(base.elegible()).to.be.false
    })
  })
})
