import Modele from 'modele'

class Users extends Modele.Resource {
  axios () {
    return {
      baseURL: 'http://www.mydomain.com/api'
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
  actions () {
    return {
      uploadAvatar: {
        config: { method: 'put', url: '/avatar' }
      }
    }
  }

  defaults () {
    return {
      createdAt: new Date()
    }
  }

  validations () {
    return {
      email: {
        presence: true,
        format: { with: /\S+@\S+\.\S+/ }
        confirmation: { with: 'email_confirmation', on: 'create' }
      },
      password: {
        length: { min: 8 }
        presence: { on: 'create' }
      }
    }
  }

  // custom

  get fullName(record) {
    return this.name + ' ' + this.surname
  }
}

export default new Users()