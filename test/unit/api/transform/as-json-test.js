import { expect } from 'chai'

import Action from '../../../../src/api/action'
import asJson from '../../../../src/api/transform/as-json'

describe('asJson', function () {
  context('when "Content-Type" header is not defined', function () {
    const action = new Action({
      request: {
        body: { foo: 'bar' }
      }
    })

    it('define "Content-Type" header', function () {
      asJson(action)

      const contentType = action.request.headers['Content-Type']

      expect(contentType).to.equal('application/json;charset=utf-8')
    })

    it('Convert body to JSON stringify', function () {
      asJson(action)

      const body = action.request.body

      expect(body).to.equal(JSON.stringify({ foo: 'bar' }))
    })
  })
})
