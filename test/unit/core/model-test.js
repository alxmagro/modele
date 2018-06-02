import { expect } from 'chai'
import sinon from 'sinon'
import FakeServer from '../../fake-server'
import Modele from '../../../src'
import User from '../../models/user'

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
      const rules = [].concat(Object.values(user._validator.rules))

      expect(rules.length).to.equal(3)
    })

    it('assign defaults', function () {
      expect(user.ligthsaberColor).to.equal('Blue')
    })

    it('assign attributes', function () {
      expect(user.name).to.equal('Luke')
    })

    context('when option ignoreNullAttributesOnAssign is false', function () {
      it('assign attributes with null values', function () {
        user = new User({ createdAt: null }, { ignoreNullAttributesOnAssign: false })

        expect(user).to.have.property('createdAt', null)
      })
    })

    context('when option ignoreNullAttributesOnAssign is true', function () {
      it('assign attributes and ignore null values', function () {
        user = new User({ createdAt: null }, { ignoreNullAttributesOnAssign: true })

        expect(user).to.not.have.property('createdAt')
      })
    })
  })

  //
  // STATIC METHODS
  //

  describe('#create', function () {
    it('creates a resource', function (done) {
      User.create({ name: 'Darth', surname: 'Vader' })

        .then(res => {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        })

        .catch(done)
    })
  })

  describe('#fetch', function () {
    it('fetch resources', function (done) {
      User.fetch()

        .then(res => {
          expect(res.data).to.deep.equal(server.db.users)
          done()
        })

        .catch(done)
    })
  })

  describe('#getGlobal', function () {
    it('returns an global', function () {
      Modele.globals.locale = 'en'

      const locale = User.getGlobal('locale')

      expect(locale).to.equal('en')

      delete Modele.globals.locale
    })

    it('returns an changed global', function () {
      Modele.globals.locale = 'pt-BR'

      const locale = User.getGlobal('locale')

      expect(locale).to.equal('pt-BR')

      delete Modele.globals.locale
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
    it('returns values assigned in option urlParams', function () {
      User.setOption('urlParams', { foo: 'bar' })

      expect(User.toParam()).to.deep.equal({ foo: 'bar' })

      User.setOption('urlParams', {})
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

  describe('.changed', function () {
    context('when attribute name is given', function () {
      it('returns true if given attribute was changed', function () {
        user._changes['name'] = true

        expect(user.changed('name')).to.be.true
      })

      it('returns false if given attribute was not changed', function () {
        expect(user.changed('name')).to.be.false
      })
    })

    context('when no param is given', function () {
      it('returns true if any attribute was changed', function () {
        user._changes['name'] = true

        expect(user.changed()).to.be.true
      })

      it('returns false if any attribute was changed', function () {
        expect(user.changed()).to.be.false
      })
    })
  })

  describe('.clear', function () {
    it('reset attributes', function () {
      user.clear()

      expect(user.toJSON()).to.deep.equal(user.defaults())
    })

    it('reset errors', function () {
      user.validate()
      user.clear()

      expect(user.valid()).to.be.true
    })

    it('reset changes', function () {
      user.name = 'Yoda'
      user.clear()

      expect(user.changed()).to.be.false
    })
  })

  describe('.create', function () {
    it('creates a resource', function (done) {
      user = new User({ name: 'Darth', surname: 'Vader' })

      user.create()

        .then(res => {
          expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
          done()
        })

        .catch(done)
    })
  })

  describe('.destroy', function () {
    it('destroy a resource', function (done) {
      const size = server.db.users.length

      user.destroy()

        .then(res => {
          expect(server.db.users.length).to.equal(size - 1)
          done()
        })

        .catch(done)
    })
  })

  describe('.fetch', function () {
    it('fetch a resource', function (done) {
      user.fetch()

        .then(res => {
          expect(res.data).to.deep.equal(server.db.users[0])
          done()
        })

        .catch(done)
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

  describe('.getGlobal', function () {
    it('returns an global', function () {
      Modele.globals.locale = 'en'

      const locale = user.getGlobal('locale')

      expect(locale).to.equal('en')

      delete Modele.globals.locale
    })

    it('returns an changed global', function () {
      Modele.globals.locale = 'pt-BR'

      const locale = user.getGlobal('locale')

      expect(locale).to.equal('pt-BR')

      delete Modele.globals.locale
    })
  })

  describe('.getOption', function () {
    it('returns an instance options if exists', function () {
      user.setOption('foo', 'bar')

      const option = user.getOption('foo')

      expect(option).to.equal('bar')
    })

    it('returns resource option if instance option doesnt exists', function () {
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

      expect(user.errors).to.have.deep.property('side', [])
    })

    it('set attribute if it was changed', function () {
      user.set('name', 'Darth')

      expect(user).to.have.property('name', 'Darth')
    })

    it('set change if it was changed', function () {
      user.set('name', 'Darth')

      expect(user.changed('name')).to.be.true
    })

    it('throws an error if trying override a Model method', function () {
      const trigger = () => user.set('sync', true)

      expect(trigger).to.throw(Error)
    })
  })

  describe('.setOption', function () {
    it('set an instance option', function () {
      user.setOption('foo', 'bar')

      expect(user._options.foo).to.equal('bar')
    })

    it('do not change Model option', function () {
      user.setOption('foo', 'bar')

      expect(User._options.foo).to.be.undefined
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

      expect(user.changed()).to.be.false
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
    it('contains attributes', function () {
      expect(user.toParam()).to.include(user.toJSON())
    })

    it('contains option urlParams', function () {
      user.setOption('urlParams', { foo: 'bar' })

      expect(user.toParam()).to.include({ foo: 'bar' })
    })

    it('contains identifier $id', function () {
      expect(user.toParam()).to.include({ $id: user.id })
    })
  })

  describe('.update', function () {
    it('update a resource', function (done) {
      user.name = 'Yoda'

      user.update()

        .then(res => {
          expect(res.data.name).to.equal('Yoda')
          done()
        })

        .catch(done)
    })

    it('update a resource with param given', function (done) {
      user.name = 'Yoda'

      user.update({ name: 'Obi-Wan' })

        .then(res => {
          expect(res.data.name).to.equal('Obi-Wan')
          done()
        })

        .catch(done)
    })
  })

  describe('.valid', function () {
    context('when attribute name is given', function () {
      it('returns true if attribute errors is empty', function () {
        user.errors['surname'].push('presence')

        expect(user.valid('name')).to.be.true
      })

      it('returns false if attribute errors has anything', function () {
        user.errors['name'].push('presence')

        expect(user.valid('name')).to.be.false
      })
    })

    context('when no param is given', function () {
      it('returns true if attribute errors are empty', function () {
        expect(user.valid()).to.be.true
      })

      it('returns false if has anything in any attribute errors', function () {
        user.errors['name'].push('presence')

        expect(user.valid()).to.be.false
      })
    })
  })

  describe('.validate', function () {
    context('when option "attribute" is supplied', function () {
      it('returns false if attribute is wrong', function () {
        user.name = null

        const report = user.validate({ attribute: 'name' })

        expect(report).to.be.false
      })

      it('set errors if attribute is wrong', function () {
        user.name = null

        user.validate({ attribute: 'name' })

        expect(user.errors).to.deep.include({
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
        const report = user.validate({ attribute: 'name' })

        expect(report).to.be.true
      })
    })

    context('when option "scope" is supplied', function () {
      it('returns false if it is wrong by given scope', function () {
        const report = user.validate({ on: 'create' })

        expect(report).to.be.false
      })

      it('set errors if it is wrong by given scope', function () {
        user.validate({ on: 'create' })

        expect(user.errors).to.deep.include({
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

        const report = user.validate({ attribute: 'password', on: 'create' })

        expect(report).to.be.true
      })
    })
  })
})
