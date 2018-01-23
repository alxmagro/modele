import { expect } from 'chai'
import Map from '../../../src/utils/map'

describe('Map', function () {
  var map

  beforeEach(function () {
    map = new Map(false)
  })

  describe('.all', function () {
    it('returns all values', function () {
      map.record({ name: 'Luke', surname: 'Skywalker' })

      expect(map.all()).to.include({ name: 'Luke', surname: 'Skywalker' })
    })
  })

  describe('.get', function () {
    it('returns property value', function () {
      map.record({ name: 'Luke', surname: 'Skywalker' })

      expect(map.get('name')).to.equal('Luke')
    })
  })

  describe('.record', function () {
    it('set all values', function () {
      map.record({ name: 'Luke', surname: 'Skywalker' })

      expect(map.all()).to.include({ name: 'Luke', surname: 'Skywalker' })
    })
  })

  describe('.set', function () {
    it('set property value', function () {
      map.set('foo', 'bar')

      expect(map.all()).to.have.property('foo', 'bar')
    })
  })

  describe('.has', function () {
    context('given a property with value equal to empty value', function () {
      it('returns false', function () {
        map.set('foo', false)

        expect(map.has('foo')).to.be.false
      })
    })

    context('given a property with value different to empty value', function () {
      it('returns false', function () {
        map.set('foo', 'bar')

        expect(map.has('foo')).to.be.true
      })
    })

    context('given a property withou value', function () {
      it('returns false', function () {
        expect(map.has('foo')).to.be.false
      })
    })
  })

  describe('.any', function () {
    it('check if any property has a value and it is different to empty', function () {
      map.record({ foo: false, bar: true })

      expect(map.any()).to.be.true
    })
  })

  describe('.clear', function () {
    it('set empty value to all properties', function () {
      map.record({ name: 'Luke', surname: 'Skywalker' })
      map.clear()

      expect(map.all()).to.deep.equal({
        name: false,
        surname: false
      })
    })
  })
})