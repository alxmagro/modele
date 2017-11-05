import express from 'express'
import bodyParser from 'body-parser'
import uuid from 'uuid'

export default class FakeServer {
  constructor (db) {
    this.db = db || {
      users: [
        {
          id: uuid(),
          name: 'Luke',
          surname: 'Skywalker',
          upvotes: 0
        },
        {
          id: uuid(),
          name: 'Han',
          surname: 'Solo',
          upvotes: 0
        },
        {
          id: uuid(),
          name: 'Leia',
          surname: 'Organa',
          upvotes: 0
        },
        {
          id: uuid(),
          name: 'Anakin',
          surname: 'Skywalker',
          upvotes: 0
        },
        {
          id: uuid(),
          name: 'Kylo',
          surname: 'Ren',
          upvotes: 0
        }
      ]
    }

    // init
    const app = express()

    // config
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // interceptor
    // app.use(function(req, res, next) {
    //   next()
    // })

    // index
    app.get('/users', (req, res) => {
      res.json(this.db.users)
    })

    // create
    app.post('/users', (req, res) => {
      const user = req.body
      user.id = uuid()
      this.db.users.push(user)

      return res.status(201).json(user)
    })

    // read
    app.get('/users/:id', (req, res) => {
      var id = req.params.id
      var user = this.db.users.find(user => user.id === id)

      if (user) {
        return res.json(user)
      }

      return res.status(404).end()
    })

    // update
    app.put('/users/:id', (req, res) => {
      var id = req.params.id
      var user = this.db.users.find(user => user.id === id)

      if (user) {
        Object.assign(user, req.body)

        return res.json(user)
      }

      return res.status(404).end()
    })

    // delete
    app.delete('/users/:id', (req, res) => {
      var id = req.params.id

      this.db.users.pop(user => user.id === id)

      return res.status(200).end()
    })

    // custom: upvote
    app.put('/users/:id/upvote', (req, res) => {
      var id = req.params.id
      var user = this.db.users.find(user => user.id === id)

      if (user) {
        user.upvotes = user.upvotes + 1
        Object.assign(user, req.body)

        return res.json(user)
      }

      return res.status(404).end()
    })

    this.app = app
  }

  start () {
    this.server = this.app.listen(3000)
  }

  stop () {
    this.server.close()
  }
}
