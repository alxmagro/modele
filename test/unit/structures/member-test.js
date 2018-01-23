import { expect } from 'chai'
import FakeServer from '../../fake-server'
import Users from '../../models/users'

describe('Member', function () {
  var server, user

  beforeEach(function () {
    server = new FakeServer()
    server.start()

    user = Users.new(server.db.users[0])
  })

  afterEach(function () {
    server.stop()
  })

  describe('#constructor', function () {
    it('register fetch action', function (done) {
      user.fetch()
        .then(res => {
          expect(res.data).to.deep.equal(server.db.users[0])
          done()
        })
        .catch(done)
    })

    it('register create action', function (done) {
      const newUser = Users.new({ name: 'Darth', surname: 'Vader' })

      newUser.create()
        .then(res => {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        })
        .catch(done)
    })

    it('register update action', function (done) {
      user.name = 'Yoda'

      user.update()
        .then(res => {
          expect(res.data.name).to.equal('Yoda')
          done()
        })
        .catch(done)
    })

    it('register delete action', function (done) {
      const size = server.db.users.length

      user.destroy()
        .then(res => {
          expect(server.db.users.length).to.equal(size - 1)
          done()
        })
        .catch(done)
    })

    it('register custom actions', function (done) {
      user.upvote()
        .then(res => {
          expect(res.data.upvotes).to.equal(1)
          done()
        })
        .catch(done)
    })

    it('register rules', function () {
      const rules = [].concat(Object.values(user.validator.rules))

      expect(rules.length).to.equal(3)
    })

    it('assign defaults', function () {
      expect(user.ligthsaberColor).to.equal('Blue')
    })

    it('assign attributes', function () {
      expect(user.name).to.equal('Luke')
    })
  })

  // base

  describe('.send', function () {
    it('send a http request', function (done) {
      user.name = 'Yoda'

      user.send({
        config: { method: 'put', data: user.toJSON() },

        success (res) {
          expect(res.data.name).to.equal('Yoda')
          done()
        },

        failure (error) {
          done(error)
        }
      })
    })
  })

  // states

  describe('.clear', function () {
    it('reset attributes', function () {
      user.clear()

      expect(user.toJSON()).to.deep.equal(user.defaults())
    })

    it('reset errors', function () {
      user.valid()
      user.clear()

      expect(user.errors.any()).to.be.false
    })

    it('reset changes', function () {
      user.name = 'Yoda'
      user.clear()

      expect(user.changes.any()).to.be.false
    })
  })

  describe('.sync', function () {
    it('synchronizes the reference and attributes', function () {
      user.name = 'Yoda'
      user.sync()

      expect(user.$).to.deep.equal(user.toJSON())
    })

    it('clear changes', function () {
      user.name = 'Yoda'
      user.sync()

      expect(user.changes.any()).to.be.false
    })
  })

  // delegates

  describe('.axios', function () {
    it('returns resource axios config', function () {
      expect(user.axios()).to.deep.equal(Users.axios())
    })
  })

  describe('.getOption', function () {
    it('returns resource option', function () {
      const memberOption = user.getOption('identifier')
      const resourceOption = Users.getOption('identifier')

      expect(memberOption).to.equal(resourceOption)
    })
  })

  describe('.routes', function () {
    it('returns resource routes', function () {
      expect(user.routes()).to.deep.equal(Users.routes())
    })
  })

  // accessor methods

  describe('.get', function () {
    it('returns an attribute', function () {
      expect(user.get('name')).to.equal('Luke')
    })

    it('returns fallback when attribute is not found', function () {
      expect(user.get('side', 'Light')).to.equal('Light')
    })
  })

  describe('.has', function () {
    it('returns true when attribute exists', function () {
      expect(user.has('name')).to.be.true
    })

    it('returns false when attribute doesnt exists', function () {
      expect(user.has('side')).to.be.false
    })
  })

  describe('.identifier', function () {
    it('returns id', function () {
      expect(user.identifier()).to.be.equal(user.id)
    })
  })

  describe('.mutated', function () {
    it('returns a mutated attribute', function () {
      user.name = '   Yoda   '

      expect(user.mutated('name')).to.equal('Yoda')
    })
  })

  describe('.saved', function () {
    it('returns salved state of an attribute', function () {
      user.name = 'Yoda'

      expect(user.saved('name')).to.equal('Luke')
    })
  })

  describe('.toJSON', function () {
    it('returns all attributes', function () {
      user.name = 'Ben'
      user.surname = 'Solo'

      expect(user.toJSON()).to.deep.equal({
        id: server.db.users[0].id,
        ligthsaberColor: 'Blue',
        name: 'Ben',
        surname: 'Solo',
        upvotes: 0
      })
    })
  })

  describe('.valid', function () {
    context('when option "attribute" is supplied', function () {
      it('returns false if attribute is wrong', function () {
        user.name = null

        const report = user.valid({ attribute: 'name' })

        expect(report).to.be.false
      })

      it('set errors if attribute is wrong', function () {
        user.name = null

        user.valid({ attribute: 'name' })

        expect(user.errors.all()).to.deep.include({
          name: [
            {
              name: 'presence',
              validator: 'modele',
              context: {
                prop: 'name',
                record: user.toJSON(),
                value: null
              }
            }
          ]
        })
      })

      it('returns true if attribute is correct', function () {
        const report = user.valid({ attribute: 'name' })

        expect(report).to.be.true
      })
    })

    context('when option "scope" is supplied', function () {
      it('returns false if it is wrong by given scope', function () {
        const report = user.valid({ on: 'create' })

        expect(report).to.be.false
      })

      it('set errors if it is wrong by given scope', function () {
        user.valid({ on: 'create' })

        expect(user.errors.all()).to.deep.include({
          password: [
            {
              name: 'presence',
              validator: 'modele',
              context: {
                on: 'create',
                prop: 'password',
                record: user.toJSON(),
                value: undefined
              }
            }
          ]
        })
      })

      it('returns true if it is correct by given scope', function () {
        user.set('password', '123123')

        const report = user.valid({ attribute: 'password', on: 'create' })

        expect(report).to.be.true
      })
    })
  })

  // modifier methods

  describe('.assign', function () {
    it('set defaults', function () {
      user.assign({ name: 'Ben', surname: 'Solo' })

      expect(user.toJSON()).to.include({ ligthsaberColor: 'Blue' })
    })

    it('set attributes', function () {
      user.assign({ name: 'Ben', surname: 'Solo' })

      expect(user.toJSON()).to.include({ name: 'Ben', surname: 'Solo' })
    })

    it('synchronizes', function () {
      user.assign({ name: 'Ben', surname: 'Solo' })

      expect(user.$).to.include({
        name: 'Ben',
        surname: 'Solo',
        ligthsaberColor: 'Blue'
      })
    })
  })

  describe('.mutate', function () {
    it('apply mutations', function () {
      user.name = '   Luke   '
      user.surname = '   Skywalker   '
      user.mutate()

      expect(user.toJSON()).to.include({
        name: 'Luke',
        surname: 'Skywalker'
      })
    })

    it('apply mutations by given attribute', function () {
      user.name = '   Luke   '
      user.surname = '   Skywalker   '
      user.mutate('name')

      expect(user.toJSON()).to.include({
        name: 'Luke',
        surname: '   Skywalker   '
      })
    })

    it('apply mutations by given attributes', function () {
      user.name = '   Luke   '
      user.surname = '   Skywalker   '
      user.mutate(['name', 'surname'])

      expect(user.toJSON()).to.include({
        name: 'Luke',
        surname: 'Skywalker'
      })
    })
  })

  describe('.set', function () {
    it('register attribute if it isnt defined', function () {
      user.set('side', 'Light')

      expect(user).to.have.property('side', 'Light')
    })

    it('set empty error list if it isnt defined', function () {
      user.set('side', 'Light')

      expect(user.errors.all()).to.have.deep.property('side', [])
    })

    it('set attribute if it was changed', function () {
      user.set('name', 'Darth')

      expect(user).to.have.property('name', 'Darth')
    })

    it('set change if it was changed', function () {
      user.set('name', 'Darth')

      expect(user.changes.get('name')).to.be.true
    })
  })
})
