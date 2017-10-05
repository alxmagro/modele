import { expect } from 'chai'
import Computed from '../../src/computed'

describe('Computed', function () {
  describe('#constructor', function () {
    context('when arg is a function', function () {
      const arg = function () {
        return this.name + ' ' + this.surname
      }

      it('set getter', function () {
        const computed = new Computed(arg)
        expect(computed).to.have.property('get', arg)
      })
    })

    context('when args is a { get, set }', function () {
      var arg, computed

      beforeEach(function () {
        arg = {
          get: function () {
            return this.name + ' ' + this.surname
          },

          set: function (value) {
            const names = value.split(' ')
            this.name = names[0]
            this.surname = names[names.length - 1]
          }
        }

        computed = new Computed(arg)
      })

      it('set getter', function () {
        expect(computed.get).to.equal(arg.get)
      })

      it('set setter', function () {
        expect(computed.set).to.equal(arg.set)
      })
    })

    context('when arg is anything else', function () {
      it('throws TypeError', function () {
        const wrong = () => new Computed('Luke Skywalker')

        expect(wrong).to.throw(TypeError)
      })
    })
  })
})
