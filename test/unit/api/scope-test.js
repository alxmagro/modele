import { expect } from 'chai'

import Scope from '../../../src/api/scope'

describe('Scope', function () {
  describe('#onMember', function () {
    it('return false when name is collection', function () {
      expect(Scope.onMember('collection')).to.equal(false)
    })

    it('return true when name is member', function () {
      expect(Scope.onMember('member')).to.equal(true)
    })
  })

  describe('#onCollection', function () {
    it('return true when name is collection', function () {
      expect(Scope.onCollection('collection')).to.equal(true)
    })

    it('return false when name is member', function () {
      expect(Scope.onCollection('member')).to.equal(false)
    })
  })
})

