import { expect } from 'chai'
import URL from '../../../src/http/url'

describe('URL', function () {
  describe ('#new', function () {
    it('join paths', function () {
      expect(URL.new('foo', 'bar').url).to.equal('foo/bar')
    })

    it('ignore null values', function () {
      expect(URL.new(null, 'bar', 'baz').url).to.equal('bar/baz')
    })

    it('nullify if all values are nil', function () {
      expect(URL.new(null).url).to.equal(null)
    })
  })

  describe('.solve', function () {
    it('interpolate', function () {
      expect(URL.new('foo', ':bar').solve({ bar: 2 })).to.equal('foo/2')
    })
  })

})