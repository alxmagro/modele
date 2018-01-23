import { expect } from 'chai'
import FakeServer from '../../fake-server'
import Users from '../../models/users'

describe('Resource', function () {
  var server

  beforeEach(function () {
    server = new FakeServer()
    server.start()
  })

  afterEach(function () {
    server.stop()
  })

  describe('#constructor', function () {
    it('register fetch action', function (done) {
      Users.fetch()
        .then(res => {
          expect(res.data).to.deep.equal(server.db.users)
          done()
        })
        .catch(done)
    })

    it('register create action', function (done) {
      const user = Users.new({ name: 'Darth', surname: 'Vader' })

      Users.create({ data: user.toJSON() })
        .then(res => {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        })
        .catch(done)
    })
  })

  // base

  describe('.send', function () {
    it('send a http request', function (done) {
      Users.send({
        config: {
          method: 'post',
          data: { name: 'Darth', surname: 'Vader' }
        },

        success (res) {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        },

        failure (error) {
          done(error)
        }
      })
    })
  })

  // factories

  describe('.new', function () {
    it('build a member with given attributes', function () {
      const user = Users.new({ name: 'Darth', surname: 'Vader' })

      expect(user).to.include({ name: 'Darth', surname: 'Vader' })
    })
  })

  describe('.stub', function () {
    it('build a member with id', function () {
      const user = Users.stub(1)

      expect(user).to.have.property('id', 1)
    })

    it('build a member with given identifier option', function () {
      // before
      Users.setOption('identifier', 'uid')

      const user = Users.stub(1)

      expect(user).to.have.property('uid', 1)

      // after
      Users.setOption('identifier', 'id')
    })
  })

  // interface

  describe('.routes', function () {
    it('returns routes', function () {
      expect(Users.routes()).to.deep.equal({
        resource: '/users{$url}',
        member: '/users/{id}{$url}'
      })
    })
  })

  // methods

  describe('.getOption', function () {
    it('returns an option', function () {
      expect(Users.getOption('identifier')).to.equal('id')
    })
  })

  describe('.setOption', function () {
    it('set an option', function () {
      // before
      Users.setOption('identifier', 'uid')

      expect(Users.getOption('identifier')).to.equal('uid')

      // after
      Users.setOption('identifier', 'id')
    })
  })
})
