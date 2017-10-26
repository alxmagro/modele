import { expect } from 'chai'

import Action from '../../../../src/api/action'
import asQuery from '../../../../src/api/transform/as-query'

describe('asQuery', function () {
  context('when action method is GET', function () {
    it('parameterize body and append to url as query', function () {
      const action = new Action({
        url: '/foo',
        request: {
          method: 'GET',
          body: {
            a: 100,
            b: 'has spaces',
            c: [1, 2, 3],
            d: { x: 9, y: 8 }
          }
        }
      })

      asQuery(action)

      expect(action.url).to.equal('/foo?a=100&b=has%20spaces&c[]=1&c[]=2&c[]=3&d[x]=9&d[y]=8')
    })
  })
})
