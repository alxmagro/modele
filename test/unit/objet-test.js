import { expect } from 'chai'

import FakeServer from '../fake-server.js'
import Modele from '../../src/modele'

describe('Objet', function () {
  var server, UserModel, BookModel

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
        defaults: {
          name: {
            presence: true
          },
          surname: {
            presence: true
          }
        },
        create: {
          password: {
            presence: true
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

    server.start()
  })

  afterEach(function () {
    server.stop()
  })

  describe('#constructor', function () {
    var record

    beforeEach(function () {
      record = UserModel.new(server.db.users[0])
    })

    it('set __modele', function () {
      expect(record).to.have.property('__modele', UserModel)
    })

    it('set __keys', function () {
      expect(record).to.have.deep.property('__keys', {})
    })

    it('set __original', function () {
      const data = Object.assign(
        {},
        { createdAt: new Date(2010, 10, 10) },
        server.db.users[0]
      )

      expect(record).to.have.deep.property('__original', data)
    })

    it('set callable custom actions', function (done) {
      record
        .findOne()
        .then(res => res.json())
        .then(res => {
          expect(res).to.deep.equal(server.db.users[0])
          done()
        })
        .catch(err => done(err))
    })

    it('set callable default actions', function (done) {
      record
        .update({ name: 'Yoda' })
        .then(res => res.json())
        .then(res => {
          expect(res).to.have.property('name', 'Yoda')
          done()
        })
        .catch(err => done(err))
    })

    it('set data', function () {
      expect(record).to.have.deep.property('createdAt', new Date(2010, 10, 10))
    })

    it('set computeds', function () {
      const expected = `${record.name} ${record.surname}`

      expect(record).to.have.property('fullName', expected)
    })

    it('set methods', function () {
      const expected = `Hi Yoda! My name is ${record.name}`

      expect(record.salute('Yoda')).to.equal(expected)
    })

    it('set associations', function () {
      record = UserModel.new({
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

      expect(record.books[0].presentation()).to.equal(expected)
    })
  })

  describe('.where', function () {
    var copy, record

    beforeEach(function () {
      record = UserModel.new({ name: 'Luke', surname: 'Skywalker' })
      copy = record.where({ api: 2 })
    })

    it('create a copy of object', function () {
      expect(record).to.deep.equal(copy)
    })

    it('assigns keys to copy', function () {
      expect(copy.__keys).to.deep.equal({ api: 2 })
    })

    it('merge keys into copy', function () {
      copy = copy.where({ foo: 42 })

      expect(copy).to.have.deep.property('__keys', { api: 2, foo: 42 })
    })

    it('keep original object keys unaltered', function () {
      expect(record.__keys).to.deep.equal({})
    })
  })

  describe('.changed', function () {
    var record

    beforeEach(function () {
      record = UserModel.new({ name: 'Luke', surname: 'Skywalker' })
    })

    it('return true when props are changed', function () {
      record.name = 'Yoda'

      expect(record.changed()).to.be.true
    })

    it('return false when props keep unchanged', function () {
      expect(record.changed()).to.be.false
    })
  })

  describe('.unchanged', function () {
    var record

    beforeEach(function () {
      record = UserModel.new({ name: 'Luke', surname: 'Skywalker' })
    })

    it('return false when props are changed', function () {
      record.name = 'Yoda'

      expect(record.unchanged()).to.be.false
    })

    it('return true when props keep unchanged', function () {
      expect(record.unchanged()).to.be.true
    })
  })

  describe('.persisted', function () {
    it('return true when has ID', function () {
      const record = UserModel.new({ id: 42, name: 'Yoda' })

      expect(record.persisted()).to.be.true
    })

    it('return false when has not ID', function () {
      const record = UserModel.new({ name: 'Yoda' })

      expect(record.persisted()).to.be.false
    })
  })

  describe('.save', function () {
    var record

    beforeEach(function () {
      record = UserModel.new(server.db.users[0])
    })

    context('when it is persisted', function () {
      it('updates the object', function (done) {
        record.name = 'Yoda'

        record
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
        const record = UserModel.new({ name: 'Yoda' })

        record
          .save()
          .then(res => {
            expect(server.db.users).to.have.lengthOf(size + 1)
          })
      })
    })
  })

  describe('.valid', function () {
    it('return false if has errors', function () {
      const record = UserModel.new({ name: 'Luke' })

      expect(record.valid()).to.be.false
    })

    it('return true if has no error', function () {
      const record = UserModel.new({ name: 'Luke', surname: 'Skywalker' })

      expect(record.valid()).to.be.true
    })

    context('when opts.prop is suplied', function () {
      it('return errors of suplied prop and ignore others', function () {
        const record = UserModel.new()

        record.valid({ prop: 'name' })

        expect(record.errors.all()).to.deep.equal({
          name: [
            {
              error: 'blank',
              ctx: {
                record: record,
                prop: 'name',
                value: undefined
              }
            }
          ]
        })
      })
    })

    context('when opts.on is supplied', function () {
      it('record errors of defaults and supplied scope', function () {
        const record = UserModel.new({ name: 'Yoda' })

        record.valid({ on: 'create' })

        expect(record.errors.all()).to.deep.equal({
          surname: [
            {
              error: 'blank',
              ctx: {
                record: record,
                prop: 'surname',
                value: undefined
              }
            }
          ],
          password: [
            {
              error: 'blank',
              ctx: {
                record: record,
                prop: 'password',
                value: undefined
              }
            }
          ]
        })
      })
    })

    context('when both opts.prop and opts.on is suplied', function () {
      it('return prop errors of defaults and suplied validators', function () {
        const record = UserModel.new({ name: 'Yoda' })

        record.valid({ on: 'create', prop: 'password' })

        expect(record.errors.all()).to.deep.equal({
          password: [
            {
              error: 'blank',
              ctx: {
                record: record,
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
