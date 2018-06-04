import { expect } from 'chai'
import RuleDict from '../../../src/core/rule-dict'
import Valuable from '../../stubs/valuable'
import Presence from '../../../src/rules/presence'

describe('RuleDict', function () {
  beforeEach(function () {})
  afterEach(function () {})

  describe('#constructor', function () {
    it('define default rules', function () {
      const dict = new RuleDict()

      expect(dict.definitions).to.have.all.keys(
        'absence',
        'acceptance',
        'confirmation',
        'date',
        'exclusion',
        'format',
        'future',
        'inclusion',
        'length',
        'past',
        'presence'
      )
    })

    it('define new rules given by parameter', function () {
      const dict = new RuleDict({ valuable: Valuable })

      expect(dict.definitions).to.have.property('valuable', Valuable)
    })
  })

  describe('append', function () {
    it('define new rules given by parameter', function () {
      const dict = new RuleDict()

      dict.append({ valuable: Valuable })

      expect(dict.definitions).to.have.property('valuable', Valuable)
    })
  })

  describe('set', function () {
    it('define new rule', function () {
      const dict = new RuleDict()

      dict.set('valuable', Valuable)

      expect(dict.definitions).to.have.property('valuable', Valuable)
    })
  })

  describe('get', function () {
    it('throws TypeError if name does not defined', function () {
      const dict = new RuleDict()
      const trigger = () => dict.get('foo', true)

      expect(trigger).to.throw(TypeError)
    })

    it('return nothing if options === false', function () {
      const dict = new RuleDict()
      const rule = dict.get('presence', false)

      expect(rule).to.equal(undefined)
    })

    it('return a rule with empty options if options === true', function () {
      const dict = new RuleDict()
      const rule = dict.get('presence', true)

      expect(rule)
        .to.be.an.instanceof(Presence)
        .and.have.deep.property('options', {})
    })

    it('return a rule with given options', function () {
      const dict = new RuleDict()
      const rule = dict.get('presence', { if: true })

      expect(rule)
        .to.be.an.instanceof(Presence)
        .and.have.deep.property('options', { if: true })
    })
  })
})
