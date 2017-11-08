import { expect } from 'chai'
import sinon from 'sinon'
import FakeServer from '../fake-server'
import User from '../models/user'

describe('Modele', function () {
  describe('instance', function () {
    var server, user

    beforeEach(function () {
      server = new FakeServer()
      user = new User(server.db.users[0])

      server.start()
    })

    afterEach(function () {
      server.stop()
    })

    // assigns

    it('should assign attributes', function () {
      expect(user.name).to.equal('Luke')
    })

    it('should assign computeds', function () {
      expect(user.fullName).to.equal('Luke Skywalker')
    })

    it('should assign methods', function () {
      expect(user.salute()).to.equal('Hello')
    })

    it('should assign defaults', function () {
      expect(user.ligthsaberColor).to.equal('Blue')
    })

    it('should choose identifier attribute', function (done) {
      user.set('uid', user.id)
      user.set('id', undefined)
      user.setOption('identifier', 'uid')

      user.fetch()
        .then(res => {
          expect(res.data).to.deep.equal(server.db.users[0])
          done()
        })
        .catch(done)
    })

    // states

    context('when no one attribute is changed', function () {
      it('should contain state changed as false', function () {
        expect(user.changed()).to.be.false
      })
    })

    context('when any attribute is changed', function () {
      it('should contain state changed as true', function () {
        user.name = 'Yoda'

        expect(user.changed()).to.be.true
      })
    })

    context('when a request is send', function () {
      beforeEach(function () {
        sinon.spy(user, 'setPending')
      })

      it('should set state pending as true', function (done) {
        user.fetch()
          .then(res => {
            expect(user.setPending.getCall(0).args[0]).to.equal(true)
            done()
          })
          .catch(done)
      })

      it('should set state pending as false when completed', function (done) {
        user.fetch()
          .then(res => {
            expect(user.setPending.getCall(1).args[0]).to.equal(false)
            done()
          })
          .catch(done)
      })
    })

    // requests

    it('should be able to fetch resource', function (done) {
      user.fetch()
        .then(res => {
          expect(res.data).to.deep.equal(server.db.users[0])
          done()
        })
        .catch(done)
    })

    it('should be able to update resource', function (done) {
      user.name = 'Yoda'

      user.update()
        .then(res => {
          expect(res.data.name).to.equal('Yoda')
          done()
        })
        .catch(done)
    })

    it('should be able to delete resource', function (done) {
      const size = server.db.users.length

      user.destroy()
        .then(res => {
          expect(server.db.users.length).to.equal(size - 1)
          done()
        })
        .catch(done)
    })

    it('should be able to call a custom request', function (done) {
      user.upvotes += 1

      user.upvote()
        .then(res => {
          expect(res.data.upvotes).to.equal(1)
          done()
        })
        .catch(done)
    })

    // validations

    it('should be able validates all attributes', function () {
      const result = user.valid()

      expect(result).to.be.false
    })

    it('should be able validates one attribute', function () {
      const result = user.valid('defaults', 'password')

      expect(result).to.be.false
    })

    it('should be able record validation errors', function () {
      user.valid()

      expect(user.errors.all()).to.deep.equal({
        password: [
          {
            name: 'presence',
            context: {
              attribute: 'password',
              record: user.toJSON(),
              value: undefined
            }
          }
        ]
      })
    })
  })
})
