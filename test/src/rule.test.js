/* eslint-env jest */
import Rule from 'core/rule'

describe('Rule', () => {
  let lengthMin

  beforeEach(() => {
    lengthMin = function (min) {
      return new Rule({
        name: 'lengthMin',
        test: (value) => value.length >= min,
        data: { min }
      })
    }
  })

  describe('#constructor', () => {
    test('set name, test and data', () => {
      const rule = lengthMin(6)

      expect(rule).toHaveProperty('name', 'lengthMin')
      expect(rule.test).toBeInstanceOf(Function)
      expect(rule.data).toHaveProperty('min', 6)
    })
  })

  describe('.if', () => {
    test('add condition to rule', () => {
      const rule = lengthMin(6).if(self => self.name)

      expect(rule.condition).toBeInstanceOf(Function)
    })

    test('retuns itself', () => {
      const rule = lengthMin(6).if(self => self.name)

      expect(rule).toBeInstanceOf(Rule)
    })
  })
})
