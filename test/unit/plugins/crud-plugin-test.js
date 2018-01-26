import { expect } from 'chai'
import FakeServer from '../../fake-server'
import User from '../../models/users'
import CRUDPlugin from '../../../src/plugins/crud-plugin'

User.use(CRUDPlugin, { mutateOnSave: true })

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

  describe('.install', function () {
    context('on class', function () {
      it('define fetch action', function (done) {
        User.fetch()

          .then(res => {
            expect(res.data).to.deep.equal(server.db.users)
            done()
          })

          .catch(done)
      })

      it('define create action', function (done) {
        User.create({ name: 'Darth', surname: 'Vader' })

          .then(res => {
            expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
            done()
          })

          .catch(done)
      })
    })

    context('on instance', function () {
      it('define fetch action', function (done) {
        user.fetch()

          .then(res => {
            expect(res.data).to.deep.equal(server.db.users[0])
            done()
          })

          .catch(done)
      })

      it('define create action', function (done) {
        user = new User({ name: 'Darth', surname: 'Vader' })

        user.create()

          .then(res => {
            expect(res.data).to.include({ name: 'Darth', surname: 'Vader' })
            done()
          })

          .catch(done)
      })

      it('define update action', function (done) {
        user.name = 'Yoda'

        user.update()

          .then(res => {
            expect(res.data.name).to.equal('Yoda')
            done()
          })

          .catch(done)
      })

      it('define delete action', function (done) {
        const size = server.db.users.length

        user.delete()

          .then(res => {
            expect(server.db.users.length).to.equal(size - 1)
            done()
          })

          .catch(done)
      })
    })
  })
})
