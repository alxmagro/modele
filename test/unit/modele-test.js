import { expect } from 'chai'
import FakeServer from '../fake-server'
import Modele from '../../src/modele'
import API from '../../src/api/api'
import Errors from '../../src/validator/errors'

describe('Modele', function () {
  var UserModel, config

  beforeEach(function () {
    config = {
      name: 'User',
      api: {
        baseURL: 'http\\://localhost\\:3000/users',
        actions: {
          defaults: {
            all: false,
            create: false,
            read: false,
            update: true,
            delete: false
          },
          custom: {
            upvote: {
              scope: 'member',
              method: 'PUT',
              path: 'upvote',
              body: false
            }
          }
        }
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

      static: {
        data: function () {
          return {
            staticData: 10
          }
        },

        computed: {
          staticComputed: function () {
            return this.staticData + 100
          }
        },

        methods: {
          staticMethod (param) {
            return param
          }
        }
      }
    }

    UserModel = new Modele(config)
  })

  describe('#constructor', function () {
    it('set __opts', function () {
      expect(UserModel).to.have.deep.property('__opts', config)
    })

    it('set __name', function () {
      expect(UserModel).to.have.property('__name', 'User')
    })

    it('set __api', function () {
      expect(UserModel.__api).to.be.an.instanceOf(API)
    })

    it('set a callable default action', function (done) {
      const server = new FakeServer()
      const user = server.db.users[0]

      server.start()

      UserModel
        .update(user.id, { name: 'Yoda' })
        .then(res => {
          expect(user).to.have.property('name', 'Yoda')

          server.stop()
          done()
        })
        .catch(err => {
          server.stop()
          done(err)
        })
    })

    it('set a callable custom action', function (done) {
      const server = new FakeServer()
      const user = server.db.users[0]
      const upvotes = user.upvotes

      server.start()

      UserModel
        .upvote(user.id)
        .then(res => {
          expect(user).to.have.property('upvotes', upvotes + 1)

          server.stop()
          done()
        })
        .catch(err => {
          server.stop()
          done(err)
        })
    })

    it('set static data', function () {
      expect(UserModel).to.have.property('staticData', 10)
    })

    it('set static computed', function () {
      expect(UserModel).to.have.property('staticComputed', 110)
    })

    it('set static method', function () {
      expect(UserModel.staticMethod(10)).to.equal(10)
    })
  })

  context('.new', function () {
    it('create a Objet instance that have this with reference', function () {
      expect(UserModel.new()).to.have.property('__modele', UserModel)
    })
  })

  context('.where', function () {
    var copy

    beforeEach(function () {
      copy = UserModel.where({ foo: 1 })
    })

    it('create a copy of object', function () {
      expect(copy).to.deep.equal(UserModel)
    })

    it('assigns keys to copy', function () {
      expect(copy).to.have.deep.property('__keys', { foo: 1 })
    })

    it('merge keys into copy', function () {
      copy = copy.where({ bar: 2 })

      expect(copy).to.have.deep.property('__keys', { foo: 1, bar: 2 })
    })

    it('keep original object keys unaltered', function () {
      expect(UserModel).to.have.deep.property('__keys', {})
    })
  })

  describe('.validate', function () {
    it('return instance of Errors', function () {
      const record = { name: 'Yoda' }
      const report = UserModel.validate(record)

      expect(report).to.be.an.instanceOf(Errors)
    })

    it('return errors', function () {
      const record = {}
      const report = UserModel.validate(record)

      expect(report.all()).to.deep.equal({
        name: [
          {
            error: 'blank',
            ctx: {
              record: record,
              prop: 'name',
              value: undefined
            }
          }
        ],
        surname: [
          {
            error: 'blank',
            ctx: {
              record: record,
              prop: 'surname',
              value: undefined
            }
          }
        ]
      })
    })

    context('when opts.prop is suplied', function () {
      it('return errors of suplied prop and ignore others', function () {
        const record = {}
        const report = UserModel.validate(record, { prop: 'name' })

        expect(report.all()).to.deep.equal({
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

    context('when opts.on is suplied', function () {
      it('return errors of defaults and suplied validators', function () {
        const record = { name: 'Yoda' }
        const report = UserModel.validate(record, { on: 'create' })

        expect(report.all()).to.deep.equal({
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
        const record = { name: 'Yoda' }
        const report = UserModel.validate(record, {
          on: 'create',
          prop: 'password'
        })

        expect(report.all()).to.deep.equal({
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
