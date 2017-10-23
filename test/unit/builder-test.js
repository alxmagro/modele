import { expect } from 'chai'
import FakeServer from '../fake-server'

import Builder from '../../src/builder'
import Modele from '../../src/modele'
import Action from '../../src/api/action'
import Validator from '../../src/validator/validator'
import Presence from '../../src/validator/rules/presence'
import Length from '../../src/validator/rules/length'

describe('Builder', function () {
  describe('.defineAssociations', function () {
    it('turn association props in Modeles on dest', function () {
      const BookModel = new Modele({
        name: 'Book',
        methods: {
          presentation: function () {
            return `${this.title} (${this.year}) by ${this.authors}`
          }
        }
      })

      const UserModel = new Modele({
        name: 'User',
        associations: {
          books: BookModel
        }
      })

      const user = UserModel.new({
        name: 'Yoda',
        books: [
          {
            title: 'Star Wars Episode IV: A New Hope',
            year: 1976,
            authors: 'Alan Dean Foster & George Lucas'
          }
        ]
      })

      const expected = [
        'Star Wars Episode IV: A New Hope',
        '(1976)',
        'by Alan Dean Foster & George Lucas'
      ].join(' ')

      expect(user.books[0].presentation()).to.equal(expected)
    })
  })

  describe('.defineActions', function () {
    var server, baseURL, UserModel, user

    beforeEach(function () {
      server = new FakeServer()
      baseURL = 'http\\://localhost\\:3000/users'

      UserModel = new Modele({
        name: 'User',
        api: {
          baseURL: 'http\\://localhost\\:3000/users',
          actions: {
            defaults: {
              all: false,
              create: false,
              read: false,
              update: false,
              delete: false
            }
          }
        }
      })

      Builder.defineActions(UserModel, {
        findAll: new Action(baseURL, {
          method: 'GET',
          scope: 'collection',
          path: false,
          data: false
        }),
        findOne: new Action(baseURL, {
          method: 'GET',
          scope: 'member',
          path: false,
          data: false
        })
      })

      user = UserModel.new(server.db.users[0])

      Builder.defineActions(user, {
        findOne: new Action(baseURL, {
          method: 'GET',
          scope: 'member',
          path: false,
          data: false
        })
      })

      server.start()
    })

    afterEach(function () {
      server.stop()
    })

    context('when called by Modele', function () {
      it('define a member action (id, body)', function (done) {
        UserModel
          .findOne(user.id)
          .then(res => res.json())
          .then(res => {
            expect(res).to.deep.equal(user)
            done()
          })
          .catch(err => done(err))
      })

      it('define a collection action (body)', function (done) {
        const size = server.db.users.length

        UserModel
          .findAll()
          .then(res => res.json())
          .then(res => {
            expect(res).to.have.lengthOf(size)
            done()
          })
          .catch(err => done(err))
      })
    })

    context('when called by Objet', function () {
      it('define a member action (body)', function (done) {
        user
          .findOne()
          .then(res => res.json())
          .then(res => {
            expect(res).to.deep.equal(server.db.users[0])
            done()
          })
          .catch(err => done(err))
      })
    })
  })

  describe('.defineData', function () {
    it('throws TypeError when source is not a function', function () {
      const dest = {}
      const src = true
      const wrong = () => Builder.defineData(dest, src)

      expect(wrong).to.throw(TypeError)
    })

    it('define source', function () {
      const dest = {}
      const src = () => ({ foo: 1, bar: 2 })

      Builder.defineData(dest, src)

      expect(dest).to.deep.equal(src())
    })
  })

  describe('.defineComputed', function () {
    it('throw TypeError when source is not a hash', function () {
      const dest = {}
      const src = true
      const wrong = () => Builder.defineComputed(dest, src)

      expect(wrong).to.throw(TypeError)
    })

    context('when it is a function', function () {
      const dest = { name: 'Luke', surname: 'Skywalker' }
      const src = {
        fullName: function () {
          return this.name + ' ' + this.surname
        }
      }

      it('define computed when it is a function', function () {
        Builder.defineComputed(dest, src)

        expect(dest.fullName).to.equal('Luke Skywalker')
      })
    })

    context('when it is a { get, set }', function () {
      var dest, src

      beforeEach(function () {
        dest = { name: 'Anakin', surname: 'Skywalker' }
        src = {
          fullName: {
            get: function () {
              return this.name + ' ' + this.surname
            },

            set: function (value) {
              const names = value.split(' ')
              this.name = names[0]
              this.surname = names[names.length - 1]
            }
          }
        }

        Builder.defineComputed(dest, src)
      })

      it('define computed getter', function () {
        expect(dest.fullName).to.equal('Anakin Skywalker')
      })

      it('define computed setter', function () {
        dest.fullName = 'Darth Vader'

        expect(dest.name + ' ' + dest.surname).to.equal('Darth Vader')
      })
    })
  })

  describe('.defineMethods', function () {
    it('throw an TypeError when src is not a object', function () {
      const wrong = () => Builder.defineMethods({}, true)

      expect(wrong).to.throw(TypeError)
    })

    it('throw an TypeError when src property is not a function', function () {
      const wrong = () => Builder.defineMethods({}, { foo: true })

      expect(wrong).to.throw(TypeError)
    })

    it('define a function to dest with proper name', function () {
      const dest = {}

      Builder.defineMethods(dest, {
        foo: () => 'hello'
      })

      expect(dest.foo()).to.equal('hello')
    })
  })

  describe('.addRulesToValidator', function () {
    it('define rules to Validator', function () {
      const validator = new Validator()

      Builder.addRulesToValidator(validator, {
        email: {
          presence: true,
          length: { min: 5 }
        },
        password: {
          presence: true
        }
      })

      expect(validator.rules).to.deep.equal({
        email: [
          new Presence(),
          new Length({ min: 5 })
        ],
        password: [
          new Presence()
        ]
      })
    })

    it('throw TypeError when one rule key are not defined', function () {
      const validator = new Validator()
      const wrong = () => {
        Builder.addRulesToValidator(validator, {
          email: {
            foo: true
          }
        })
      }

      expect(wrong).to.throw(TypeError)
    })
  })
})
