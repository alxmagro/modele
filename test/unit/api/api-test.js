import { expect } from 'chai'
import API from '../../../src/api/api'

describe('API', function () {
  var api

  beforeEach(function () {
    api = new API({
      baseURL: '/api/:api/groups/:group_id/users',
      actions: {
        defaults: {
          create: false,
          update: false,
          delete: false
        },
        custom: {
          upvote: {
            method: 'GET',
            scope: 'member',
            path: 'upvote',
            data: false
          }
        }
      }
    })
  })

  describe('#constructor', function () {
    it('set actions', function () {
      expect(Object.keys(api.actions)).to.deep.equal(['all', 'read', 'upvote'])
    })
  })
})
