import { expect } from 'chai'
import Rule from '../../../src/validation/rule'

describe('Rule', function () {
  var test, Test

  beforeEach(function () {
    test = (value) => value
    Test = class extends Rule {
      definitions () {
        return {
          name: 'foo',
          test: test
        }
      }
    }
  })

  describe('#constructor', function () {
    it('set name, test and options given a definition', function () {
      const rule = new Test({ some: 'option' })

      expect(rule).to.deep.include({
        name: 'foo',
        test: test,
        options: { some: 'option' }
      })
    })
  })

  describe('.elegible', function () {
    it('returns true if "if" and "on" options is not supplied', function () {
      const rule = new Test()

      expect(rule.elegible()).to.be.true
    })

    it('returns false if "if" option is a function that returns false', function () {
      const rule = new Test({ if: () => false })

      expect(rule.elegible()).to.be.false
    })

    it('returns false if "on" option is different to supplied scope', function () {
      const rule = new Test({ on: 'create' })

      expect(rule.elegible('update')).to.be.false
    })
  })

  describe('.verify', function () {
    context('when .test return false', function () {
      it('returns descriptive error object', function () {
        const record = { value: false }
        const rule = new Test()

        expect(rule.verify(record, 'value')).to.deep.equal({
          name: 'foo',
          validator: 'modele',
          context: {
            prop: 'value',
            record: record,
            value: false
          }
        })
      })
    })

    context('when .test return true', function () {
      it('returns nothing', function () {
        const record = { value: true }
        const rule = new Test()

        expect(rule.verify(record, 'value')).to.be.undefined
      })
    })
  })

  describe('.solved', function () {
    it('returns param if isnt a function', function () {
      const rule = new Test()

      expect(rule.solved('foo')).to.equal('foo')
    })

    it('returns params return if is a function', function () {
      const rule = new Test()

      expect(rule.solved(() => 'foo')).to.equal('foo')
    })
  })
})
