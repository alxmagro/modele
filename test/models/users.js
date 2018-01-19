import Modele from '../../src/modele'

class Users extends Modele.Resource {
  axios () {
    return {
      baseURL: 'http://localhost:3000'
    }
  }

  routes () {
    return {
      resource: '/users{$url}',
      member: '/users/{id}{$url}'
    }
  }

  member () {
    return User
  }
}

class User extends Modele.Member {
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
      defaults: {
        name: { presence: true },
        surname: { presence: true },
        password: { presence: true }
      }
    }
  }

  actions () {
    return {
      upvote: {
        config: { method: 'put', url: '/upvote' }
      }
    }
  }

  // custom

  get fullName () {
    return this.name + ' ' + this.surname
  }

  salute (name) {
    return 'Hello'
  }
}

export default new Users()
