import { expect } from 'chai'
import FakeServer from '../../fake-server'

import Action from '../../../src/api/action'

describe('Action', function () {
  var action

  beforeEach(function () {
    action = new Action('http\\://localhost\\:3000/users', {
      scope: 'member',
      path: 'update',
      method: 'PUT',
      body: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  })

  describe('#constructor', function () {
    it('set baseURL', function () {
      expect(action).to.have.property('baseURL', 'http\\://localhost\\:3000/users')
    })

    it('set scope', function () {
      expect(action).to.have.property('scope', 'member')
    })

    it('set path', function () {
      expect(action).to.have.property('path', 'update')
    })

    it('set method', function () {
      expect(action).to.have.property('method', 'PUT')
    })

    it('set headers', function () {
      expect(action).to.deep.have.property('headers', {
        'Content-Type': 'multipart/form-data'
      })
    })
  })

  describe('#toQuery', function () {
    it('convert params to URL query', function () {
      const output = Action.toQuery({
        a: 100,
        b: 'has spaces',
        c: [1, 2, 3],
        d: { x: 9, y: 8 }
      })

      expect(output).to.equal('a=100&b=has%20spaces&c[]=1&c[]=2&c[]=3&d[x]=9&d[y]=8')
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

    it('send Object if opts.config.json is true', function (done) {
      const create = new Action('http\\://localhost\\:3000/users', {
        method: 'POST'
      })

      create
        .call({
          data: { name: 'Yoda' },
          config: { json: true }
        })
        .then(res => res.json())
        .then(res => {
          expect(res.name).to.equal('Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('send data as query params if method is GET', function (done) {
      const list = new Action('http\\://localhost\\:3000/users')

      list
        .call({
          data: { sort: 'createdAt' }
        })
        .then(res => {
          expect(res.url).to.equal('http://localhost:3000/users?sort=createdAt')
          done()
        })
        .catch(err => done(err))
    })

    it('can list', function (done) {
      const list = new Action('http\\://localhost\\:3000/users')
      const size = server.db.users.length

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
      const create = new Action('http\\://localhost\\:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      create
        .call({
          data: JSON.stringify({ name: 'Yoda' })
        })
        .then(res => res.json())
        .then(res => {
          expect(res.name).to.equal('Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('can read', function (done) {
      const user = server.db.users[0]
      const action = new Action('http\\://localhost\\:3000/users', {
        scope: 'member'
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
      const action = new Action('http\\://localhost\\:3000/users', {
        scope: 'member',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      action
        .call({
          id: user.id,
          data: JSON.stringify({ name: 'Yoda' })
        })
        .then(res => {
          expect(user.name).to.equal('Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('can destroy', function (done) {
      const size = server.db.users.length
      const action = new Action('http\\://localhost\\:3000/users', {
        method: 'DELETE',
        scope: 'member'
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

  describe('.__url', function () {
    it('append ID to baseURL', function () {
      const action = new Action('example.com/users')

      expect(action.__url(42)).to.equal('example.com/users/42')
    })

    it('append path to baseURL', function () {
      const action = new Action('example.com/users', { path: 'search' })

      expect(action.__url()).to.equal('example.com/users/search')
    })

    it('append ID and path to baseURL', function () {
      action = new Action('example.com/users', { path: 'edit' })

      expect(action.__url(42)).to.equal('example.com/users/42/edit')
    })

    it('solve snake_cased keys', function () {
      action = new Action('/api/:api/group/:group_id/users')
      const url = action.__url(null, { api: 1, group_id: 42 })

      expect(url).to.equal('/api/1/group/42/users')
    })

    it('solve camelCased keys', function () {
      action = new Action('/api/:api/group/:groupId/users')
      const url = action.__url(null, { api: 1, groupId: 42 })

      expect(url).to.equal('/api/1/group/42/users')
    })
  })
})
