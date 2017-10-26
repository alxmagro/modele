import { expect } from 'chai'
import FakeServer from '../../fake-server'

import Action from '../../../src/api/action'

describe('Action', function () {
  var action

  beforeEach(function () {
    action = new Action({
      scope: 'member',
      baseURL: 'http://localhost:3000/users',
      url: 'update',
      request: {
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    })
  })

  describe('#constructor', function () {
    it('set baseURL', function () {
      expect(action).to.have.property('baseURL', 'http://localhost:3000/users')
    })

    it('set scope', function () {
      expect(action).to.have.property('scope', 'member')
    })

    it('set url', function () {
      expect(action).to.have.property('url', 'update')
    })

    it('set request.method', function () {
      expect(action.request).to.have.property('method', 'PUT')
    })

    it('set request.headers', function () {
      expect(action.request).to.deep.have.property('headers', {
        'Content-Type': 'multipart/form-data'
      })
    })
  })

  describe('.call', function () {
    var server

    beforeEach(function () {
      server = new FakeServer()

      server.start()
    })

    afterEach(function () {
      server.stop()
    })

    it('can list', function (done) {
      const size = server.db.users.length
      const list = new Action({
        baseURL: 'http://localhost:3000/users'
      })

      list
        .call()
        .then(res => res.json())
        .then(data => {
          expect(data).to.have.lengthOf(size)
          done()
        })
        .catch(err => done(err))
    })

    it('can create', function (done) {
      const create = new Action({
        baseURL: 'http://localhost:3000/users',
        request: {
          method: 'POST',
          body: JSON.stringify({ name: 'Yoda' }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })

      create
        .call()
        .then(res => res.json())
        .then(res => {
          expect(res.name).to.equal('Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('can read', function (done) {
      const user = server.db.users[0]
      const action = new Action({
        scope: 'member',
        baseURL: 'http://localhost:3000/users'
      })

      action
        .call({ id: user.id })
        .then(res => res.json())
        .then(data => {
          expect(data).to.deep.equal(user)
          done()
        })
        .catch(err => done(err))
    })

    it('can update', function (done) {
      const user = server.db.users[0]
      const action = new Action({
        scope: 'member',
        baseURL: 'http://localhost:3000/users',
        request: {
          method: 'PUT',
          body: JSON.stringify({ name: 'Yoda' }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })

      action
        .call({ id: user.id })
        .then(res => {
          expect(user.name).to.equal('Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('can destroy', function (done) {
      const size = server.db.users.length
      const action = new Action({
        scope: 'member',
        baseURL: 'http://localhost:3000/users',
        request: {
          method: 'DELETE'
        }
      })

      action
        .call({ id: server.db.users[0].id })
        .then(res => {
          expect(server.db.users).to.have.lengthOf(size - 1)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('.solvedURL', function () {
    context('when action scope is "member"', function () {
      var action

      beforeEach(function () {
        action = new Action({
          scope: 'member',
          baseURL: 'example.com/users'
        })
      })

      it('throw TypeError if ID is undefined', function () {
        const wrong = () => action.solvedURL()

        expect(wrong).to.throw(TypeError)
      })

      it('append ID to baseURL', function () {
        expect(action.solvedURL(42)).to.equal('example.com/users/42')
      })

      it('append ID and path to baseURL', function () {
        action = new Action({
          baseURL: 'example.com/users',
          url: 'edit'
        })

        expect(action.solvedURL(42)).to.equal('example.com/users/42/edit')
      })
    })

    context('when action scope is "collection"', function () {
      it('append path to baseURL', function () {
        const action = new Action({
          baseURL: 'example.com/users',
          url: 'search'
        })

        expect(action.solvedURL()).to.equal('example.com/users/search')
      })

      it('solve snake_cased keys', function () {
        action = new Action({
          baseURL: '/api/:api/group/:group_id/users'
        })

        const url = action.solvedURL(null, { api: 1, group_id: 42 })

        expect(url).to.equal('/api/1/group/42/users')
      })

      it('solve camelCased keys', function () {
        action = new Action({
          baseURL: '/api/:api/group/:groupId/users'
        })

        const url = action.solvedURL(null, { api: 1, groupId: 42 })

        expect(url).to.equal('/api/1/group/42/users')
      })
    })
  })
})
