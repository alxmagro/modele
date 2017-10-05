import { expect } from 'chai'
import FakeServer from '../fake-server'
import Modele from '../../src/modele'
import API from '../../src/api/api'

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

  describe('.creatable', function () {
    it('return prop error if prop is suplied', function () {
      const record = { name: 'Yoda' }
      const report = UserModel.creatable(record, 'password')

      expect(report).to.deep.equal([
        {
          message: 'blank',
          vars: {
            prop: 'password',
            value: undefined
          }
        }
      ])
    })

    it('return all props if prop isnt suplied', function () {
      const record = { name: 'Yoda' }
      const report = UserModel.creatable(record)

      expect(report).to.deep.equal({
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
  })

  describe('.updatable', function () {
    it('return prop error if prop is suplied', function () {
      const record = { name: 'Yoda', password: '123123' }
      const report = UserModel.updatable(record, 'password')

      expect(report).to.deep.equal([
        {
          message: 'confirmation',
          vars: {
            prop: 'confirmation',
            referred: 'password',
            value: undefined
          }
        }
      ])
    })

    it('return all props if prop isnt suplied', function () {
      const record = { name: 'Yoda', password: '123123' }
      const report = UserModel.updatable(record)

      expect(report).to.deep.equal({
        confirmation: [
          {
            message: 'confirmation',
            vars: {
              prop: 'confirmation',
              referred: 'password',
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
  })
})
