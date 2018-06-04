import { expect } from 'chai'
import Valuable from '../../stubs/valuable'

describe('Rule', function () {
  describe('#constructor', function () {
    it('set name, test and options given a definition', function () {
      const rule = new Valuable({ some: 'option' })

      expect(rule).to.have.all.keys('name', 'test', 'options')
    })
  })

  describe('.elegible', function () {
    it('returns true if "if" and "on" options is not supplied', function () {
      const rule = new Valuable()

      expect(rule.elegible()).to.be.true
    })

    it('returns false if "if" option is a function that returns false', function () {
      const rule = new Valuable({ if: () => false })

      expect(rule.elegible()).to.be.false
    })

    it('returns false if "on" option is different to supplied scope', function () {
      const rule = new Valuable({ on: 'create' })

      expect(rule.elegible('update')).to.be.false
    })
  })

  describe('.verify', function () {
    context('when .test return false', function () {
      it('returns descriptive error object', function () {
        const record = { value: false }
        const rule = new Valuable()

        expect(rule.verify(record, 'value')).to.deep.equal({
          name: 'valuable',
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
        const rule = new Valuable()

        expect(rule.verify(record, 'value')).to.be.undefined
      })
    })
  })

  describe('.solved', function () {
    it('returns param if isnt a function', function () {
      const rule = new Valuable()

      expect(rule.solved('foo')).to.equal('foo')
    })

    it('returns params return if is a function', function () {
      const rule = new Valuable()

      expect(rule.solved(() => 'foo')).to.equal('foo')
    })
  })
})
