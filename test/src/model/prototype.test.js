/* eslint-env jest */
import 'regenerator-runtime/runtime'

// helpers
import { presence } from 'validations'
import User from 'helpers/models/user'
import delayPromise from 'helpers/delay-promise'

describe('Model Prototype', () => {
  let user

  describe('.$validate', () => {
    test('returns true when no errors', () => {
      user = new User({ name: 'Luke' })

      expect(user.$validate()).toBe(true)
    })

    test('returns false when property has errors', () => {
      user = new User({ surname: 'Skywalker' })

      expect(user.$validate()).toBe(false)
    })

    test('returns false when has error on dynamic validation', () => {
      user = new User({ name: 'Luke' })
      user.$rules.password.push(presence())

      expect(user.$validate()).toBe(false)
    })
  })

  describe('.$validateProp', () => {
    test('returns true when no errors on property', () => {
      user = new User()

      expect(user.$validateProp('surname')).toBe(true)
    })

    test('returns true when wrong rule has falsy condition', () => {
      user = new User({ passwordConfirmation: 'Test' })

      expect(user.$validateProp('passwordConfirmation')).toBe(true)
    })

    test('returns false when property has errors', () => {
      user = new User({ surname: 'Skywalker' })

      expect(user.$validateProp('name')).toBe(false)
    })

    test('returns false when has error on dynamic validation', () => {
      user = new User({ name: 'Luke' })
      user.$rules.password.push(presence())

      expect(user.$validateProp('password')).toBe(false)
    })
  })

  describe('.$wait', () => {
    test('returns given promise', () => {
      user = new User()

      const promise = Promise.resolve()
      const result = user.$wait(promise)

      expect(result).toStrictEqual(promise)
    })

    test('set pending when promise is resolved', async () => {
      user = new User()

      await user.$wait(delayPromise(100, () => {
        expect(user.$pending).toBe(true)

        return true
      }))

      expect(user.$pending).toBe(false)
    })

    test('set pending when promise is rejected', async () => {
      user = new User()

      await user.$wait(delayPromise(100, () => {
        expect(user.$pending).toBe(true)

        return false
      }))
        .catch(() => {
          expect(user.$pending).toBe(false)
        })
    })
  })

  describe('.toJSON', () => {
    test('apply mutations and return a plain object', () => {
      user = new User({ name: '   Darth   ' })

      expect(user.toJSON()).toEqual({ name: 'Darth' })
    })

    test('ignore private ($) properties', () => {
      user = new User({ name: 'Darth', $evil: true })

      expect(user.toJSON()).toHaveProperty('name')
      expect(user.toJSON()).not.toHaveProperty('$evil')
    })
  })
})
