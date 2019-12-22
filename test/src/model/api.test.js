/* eslint-env jest */
import 'regenerator-runtime/runtime'

// externals
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// helpers
import User from 'helpers/models/user'
import Post from 'helpers/models/post'

describe('Model API', () => {
  let mock = new MockAdapter(axios)

  beforeEach(() => {
    mock.reset()
  })

  describe('#url', () => {
    test('returns the url with query parameters', () => {
      const url = User.url({ name: 'Leia' })

      expect(url).toBe('/users?name=Leia')
    })

    test('returns the url and keep only required variables', () => {
      const url = Post.url()

      expect(url).toBe('/users/:userId/posts')
    })

    test('returns the url and replace variables', () => {
      const url = Post.url({}, { userId: 2 })

      expect(url).toBe('/users/2/posts')
    })
  })

  describe('#toQuery', () => {
    test('returns nothing when no parameters is given', () => {
      expect(User.toQuery()).toBe(undefined)
    })

    test('returns query string to given parameters', () => {
      const params = User.toQuery({
        'filter[status]': 'ACTIVE',
        'include': ['user', 'category'],
        'append': 'likes'
      })

      expect(decodeURIComponent(params)).toBe(
        'filter[status]=ACTIVE&' +
        'include=user,category&' +
        'append=likes'
      )
    })
  })

  describe('#get', () => {
    test('get resources', async () => {
      mock.onGet('/users').reply(200, [1, 2])

      const response = await User.get()

      expect(response.data).toEqual([1, 2])
    })

    test('get a single resource', async () => {
      mock.onGet('/users/1').reply(200, 1)

      const response = await User.get({}, { id: 1 })

      expect(response.data).toBe(1)
    })

    test('get resources with parameters', async () => {
      mock.onGet('/users?limit=1').reply(200, [1])

      const response = await User.get({ limit: 1 })

      expect(response.data).toEqual([1])
    })

    test('get resources with variables', async () => {
      mock.onGet('/users/1/posts').reply(200, [1, 2])

      const response = await Post.get({}, { userId: 1 })

      expect(response.data).toEqual([1, 2])
    })
  })

  describe('#create', () => {
    test('create a resource', async () => {
      mock.onPost('/users').reply(201, { name: 'Darth' })

      const response = await User.create({ name: 'Darth' })

      expect(response.data).toEqual({ name: 'Darth' })
    })

    test('create a resource with variables', async () => {
      mock.onPost('/users/1/posts').reply(201, { title: 'To Leia!' })

      const response = await Post.create({ title: 'To Leia!' }, { userId: 1 })

      expect(response.data).toEqual({ title: 'To Leia!' })
    })
  })

  describe('#update', () => {
    test('update a resource', async () => {
      mock.onPut('/users/1').reply(201, { title: 'To Rebels!' })

      const response = await User.update({ title: 'To Rebels!' }, { id: 1 })

      expect(response.data).toEqual({ title: 'To Rebels!' })
    })

    test('update a resource with variables', async () => {
      mock.onPut('/users/1/posts/2').reply(201, { title: 'To Rebels!' })

      const response = await Post.update({ title: 'To Rebels!' }, { userId: 1, id: 2 })

      expect(response.data).toEqual({ title: 'To Rebels!' })
    })
  })

  describe('#delete', () => {
    test('delete a resource', async () => {
      mock.onDelete('/users/1/posts/2').reply(200)

      const response = await Post.delete({ userId: 1, id: 2 })

      expect(response.status).toBe(200)
    })
  })
})
