import _ from 'lodash'
import Modele from '../../src/modele'

class Users extends Modele.Resource {
  options () {
    return {
      requestOptions: {
        baseURL: 'http://localhost:3000'
      }
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
      name: [String, _.trim],
      surname: [String, _.trim]
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
