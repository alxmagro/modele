import Modele from '../../src'

class User extends Modele.Model {
  static axios () {
    return {
      baseURL: 'http://localhost:3000'
    }
  }

  static boot () {
    this.classProperty = 'Some value'
  }

  static routes () {
    return {
      collection: '/users',
      member: '/users/{$id}'
    }
  }

  defaults () {
    return {
      ligthsaberColor: 'Blue'
    }
  }

  mutations () {
    return {
      name: (value) => String(value).trim(),
      surname: (value) => String(value).trim()
    }
  }

  validation () {
    return {
      name: { presence: true },
      surname: { presence: true },
      password: { presence: { on: 'create' }}
    }
  }

  // actions

  upvote () {
    const config = {
      url: '/upvote',
      method: 'put'
    }

    return this.request(config)
  }

  // getters

  get fullName () {
    return this.name + ' ' + this.surname
  }

  // methods

  salute (name) {
    return 'Hello'
  }
}

export default User.init()
