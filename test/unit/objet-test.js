import { expect } from 'chai'

import FakeServer from '../fake-server.js'
import Modele from '../../src/modele'

describe('Objet', function () {
  var server, UserModel, BookModel, user

  beforeEach(function () {
    server = new FakeServer()

    BookModel = new Modele({
      name: 'Book',
      methods: {
        presentation: function () {
          return `${this.title} (${this.year}) by ${this.authors}`
        }
      }
    })

    UserModel = new Modele({
      name: 'User',
      api: {
        baseURL: 'http\\://localhost\\:3000/users',
        actions: {
          defaults: {
            all: false,
            create: true,
            read: false,
            update: true,
            delete: false
          },
          custom: {
            findAll: {
              method: 'GET',
              scope: 'collection',
              path: false,
              data: false
            },
            findOne: {
              method: 'GET',
              scope: 'member',
              path: false,
              data: false
            }
          }
        }
      },

      associations: {
        books: BookModel
      },

      validates: {
        onSave: {
          name: {
            presence: true
          },
          surname: {
            presence: true
          }
        },
        onCreate: {
          password: {
            presence: true
          }
        },
        onUpdate: {
          password: {
            confirmation: {
              with: 'confirmation',
              if: (record) => record.password
            }
          }
        }
      },

      data: function () {
        return {
          createdAt: new Date(2010, 10, 10)
        }
      },

      computed: {
        fullName: function () {
          return `${this.name} ${this.surname}`
        }
      },

      methods: {
        salute: function (name) {
          return `Hi ${name}! My name is ${this.name}`
        }
      }
    })

    user = UserModel.new(server.db.users[0])

    server.start()
  })

  afterEach(function () {
    server.stop()
  })

  describe('#constructor', function () {
    it('set __modele', function () {
      expect(user).to.have.property('__modele', UserModel)
    })

    it('set __keys', function () {
      expect(user).to.have.deep.property('__keys', {})
    })

    it('set __original', function () {
      const data = Object.assign(
        {},
        { createdAt: new Date(2010, 10, 10) },
        server.db.users[0]
      )

      expect(user).to.have.deep.property('__original', data)
    })

    it('set callable custom actions', function (done) {
      user
        .findOne()
        .then(res => res.json())
        .then(res => {
          expect(res).to.deep.equal(server.db.users[0])
          done()
        })
        .catch(err => done(err))
    })

    it('set callable default actions', function (done) {
      user
        .update({ name: 'Yoda' })
        .then(res => res.json())
        .then(res => {
          expect(res).to.have.property('name', 'Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('set data', function () {
      expect(user).to.have.deep.property('createdAt', new Date(2010, 10, 10))
    })

    it('set computeds', function () {
      const expected = `${user.name} ${user.surname}`

      expect(user).to.have.property('fullName', expected)
    })

    it('set methods', function () {
      const expected = `Hi Yoda! My name is ${user.name}`

      expect(user.salute('Yoda')).to.equal(expected)
    })

    it('set associations', function () {
      user = UserModel.new({
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

  describe('.where', function () {
    var copy

    beforeEach(function () {
      copy = user.where({ api: 2 })
    })

    it('create a copy of object', function () {
      expect(user).to.deep.equal(copy)
    })

    it('assigns keys to copy', function () {
      expect(copy.__keys).to.deep.equal({ api: 2 })
    })

    it('merge keys into copy', function () {
      copy = copy.where({ foo: 42 })

      expect(copy).to.have.deep.property('__keys', { api: 2, foo: 42 })
    })

    it('keep original object keys unaltered', function () {
      expect(user.__keys).to.deep.equal({})
    })
  })

  describe('.changed', function () {
    it('return true when props are changed', function () {
      user.name = 'Yoda'

      expect(user.changed()).to.be.true
    })

    it('return false when props keep unchanged', function () {
      expect(user.changed()).to.be.false
    })
  })

  describe('.unchanged', function () {
    it('return false when props are changed', function () {
      user.name = 'Yoda'

      expect(user.unchanged()).to.be.false
    })

    it('return true when props keep unchanged', function () {
      expect(user.unchanged()).to.be.true
    })
  })

  describe('.persisted', function () {
    it('return true when has ID', function () {
      expect(user.persisted()).to.be.true
    })

    it('return false when has not ID', function () {
      const newUser = UserModel.new()

      expect(newUser.persisted()).to.be.false
    })
  })

  describe('.save', function () {
    context('when it is persisted', function () {
      it('updates the object', function (done) {
        user.name = 'Yoda'

        user
          .save()
          .then(res => {
            expect(server.db.users[0]).to.have.property('name', 'Yoda')
            done()
          })
          .catch(err => done(err))
      })
    })

    context('when it is new record', function () {
      it('creates an object', function () {
        const size = server.db.users.length
        const newUser = UserModel.new({ name: 'Yoda' })

        newUser
          .save()
          .then(res => {
            expect(server.db.users).to.have.lengthOf(size + 1)
          })
      })
    })
  })

  describe('.valid', function () {
    context('when Objet is persisted', function () {
      it('record updatable errors', function () {
        user.name = 'Yoda'
        user.surname = ''
        user.password = '123123'
        user.valid()

        expect(user.errors.errors).to.deep.equal({
          surname: [
            {
              message: 'blank',
              vars: {
                prop: 'surname',
                value: ''
              }
            }
          ],
          confirmation: [
            {
              message: 'confirmation',
              vars: {
                prop: 'confirmation',
                referred: 'password',
                value: undefined
              }
            }
          ]
        })
      })

      it('record updatable prop errors if prop is supplied', function () {
        user.name = 'Yoda'
        user.surname = ''
        user.password = '123123'
        user.valid('password')

        expect(user.errors.errors).to.deep.equal({
          confirmation: [
            {
              message: 'confirmation',
              vars: {
                prop: 'confirmation',
                referred: 'password',
                value: undefined
              }
            }
          ]
        })
      })
    })

    context('when Objet is new record', function () {
      it('record creatable errors', function () {
        const newUser = UserModel.new({
          name: 'Yoda'
        })

        newUser.valid()

        expect(newUser.errors.errors).to.deep.equal({
          password: [
            {
              message: 'blank',
              vars: {
                prop: 'password',
                value: undefined
              }
            }
          ],
          surname: [
            {
              message: 'blank',
              vars: {
                prop: 'surname',
                value: undefined
              }
            }
          ]
        })
      })

      it('record creatable prop errors if prop is supplied', function () {
        const newUser = UserModel.new({
          name: 'Yoda'
        })

        newUser.valid('password')

        expect(newUser.errors.errors).to.deep.equal({
          password: [
            {
              message: 'blank',
              vars: {
                prop: 'password',
                value: undefined
              }
            }
          ]
        })
      })
    })
  })
})
