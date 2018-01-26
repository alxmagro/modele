import { expect } from 'chai'
import sinon from 'sinon'
import FakeServer from '../../fake-server'
import User from '../../models/users'

describe('Model', function () {
  var server, user

  beforeEach(function () {
    server = new FakeServer()
    server.start()

    user = new User(server.db.users[0])
  })

  afterEach(function () {
    server.stop()
  })

  describe('#constructor', function () {
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

  //
  // STATIC METHODS
  //

  describe('#clearState', function () {
    it('resets internal variables', function () {
      User.where({ foo: 'bar' })
      User.clearState()

      expect(User.toParam()).to.deep.equal({})
    })
  })

  describe('#getOption', function () {
    it('returns an option', function () {
      const option = User.getOption('identifier')

      expect(option).to.equal('id')
    })
  })

  describe('#getRoute', function () {
    it('returns an route', function () {
      const route = User.getRoute('collection')

      expect(route).to.equal('/users')
    })
  })

  describe('#init', function () {
    it('calls #boot', function () {
      expect(User.classProperty).to.equal('Some value')
    })
  })

  describe('#new', function () {
    it('build a member with given attributes', function () {
      const user = new User({ name: 'Darth', surname: 'Vader' })

      expect(user).to.include({ name: 'Darth', surname: 'Vader' })
    })
  })

  describe('#request', function () {
    it('send a http request', function (done) {
      const config = {
        method: 'post',
        data: { name: 'Darth', surname: 'Vader' }
      }

      User.request(config)

        .then(res => {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        })

        .catch(error => {
          done(error)
        })
    })
  })

  describe('#setOption', function () {
    it('set an option', function () {
      // before
      User.setOption('identifier', 'uid')

      expect(User.getOption('identifier')).to.equal('uid')

      // after
      User.setOption('identifier', 'id')
    })
  })

  describe('#stub', function () {
    it('build a member with id', function () {
      const user = User.stub(1)

      expect(user).to.have.property('id', 1)
    })

    it('build a member with given identifier option', function () {
      // before
      User.setOption('identifier', 'uid')

      const user = User.stub(1)

      expect(user).to.have.property('uid', 1)

      // after
      User.setOption('identifier', 'id')
    })
  })

  describe('#toParam', function () {
    it('returns values assigned in where', function () {
      User.where({ foo: 'bar' })

      expect(User.toParam()).to.deep.equal({ foo: 'bar' })

      User.clearState()
    })
  })

  describe('#use', function () {
    it('calls function .install from supplied plugin', function () {
      const pluginStub = { install: sinon.spy() }
      const pluginOptions = { foo: 'bar' }

      User.use(pluginStub, pluginOptions)

      expect(pluginStub.install.calledWith(User, pluginOptions)).to.be.true
    })
  })

  describe('#where', function () {
    it('include values to route params', function () {
      User.where({ foo: 'bar' })

      expect(User.toParam()).includes({ foo: 'bar' })

      User.clearState()
    })
  })

  //
  // INSTANCE
  //

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

  describe('.axios', function () {
    it('returns resource axios config', function () {
      expect(user.axios()).to.deep.equal(User.axios())
    })
  })

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

  describe('.get', function () {
    it('returns an attribute', function () {
      expect(user.get('name')).to.equal('Luke')
    })

    it('returns fallback when attribute is not found', function () {
      expect(user.get('side', 'Light')).to.equal('Light')
    })
  })

  describe('.getOption', function () {
    it('returns resource option', function () {
      const option = user.getOption('identifier')

      expect(option).to.equal('id')
    })
  })

  describe('.getRoute', function () {
    it('returns resource route', function () {
      const route = user.getRoute('collection')

      expect(route).to.equal('/users')
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

  describe('.mutated', function () {
    it('returns a mutated attribute', function () {
      user.name = '   Yoda   '

      expect(user.mutated('name')).to.equal('Yoda')
    })
  })

  describe('.request', function () {
    it('send a http request', function (done) {
      user.name = 'Yoda'

      user.request({ method: 'put', data: user.toJSON() })

        .then(res => {
          expect(res.data.name).to.equal('Yoda')
          done()
        })

        .catch(done)
    })
  })

  describe('.reset', function () {
    it('Resets attributes to values the last time the object was sync', function () {
      user.name = 'Yoda'
      user.reset()

      expect(user.name).to.equal(server.db.users[0].name)
    })
  })

  describe('.saved', function () {
    it('returns salved state of an attribute', function () {
      user.name = 'Yoda'

      expect(user.saved('name')).to.equal('Luke')
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

  describe('.toParam', function () {
    it('returns attributes, route params and virtual id', function () {
      user.where({ foo: 'bar' })

      const expected = Object.assign(
        user.toJSON(),
        { foo: 'bar' },
        { $id: user.id }
      )

      expect(user.toParam()).to.deep.equal(expected)
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

  describe('.where', function () {
    it('includes values to route params', function () {
      user.where({ foo: 'baz' })

      expect(user.toParam()).include({ foo: 'baz' })
    })
  })
})
