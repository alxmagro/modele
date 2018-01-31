import Modele from 'modele'

class User extends Modele.Model {
  static axios () {
    return {
      baseURL: 'http://www.mydomain.com/api'
    }
  }

  static routes () {
    return {
      collection: '/users',
      member: '/users/{$id}'
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
        format: { with: /\S+@\S+\.\S+/ },
        confirmation: { with: 'email_confirmation', on: 'create' }
      },
      password: {
        length: { min: 8 },
        presence: { on: 'create' }
      }
    }
  }

  // getters

  get fullName () {
    return this.name + ' ' + this.surname
  }

  // methods

  uploadAvatar () {
    const config = {
      url: '/avatar',
      method: 'put',
      data: this.toJSON()
    }

    return this.request(config)
      .then(response => {
        this.assign(response)

        return response
      })
  }
}

export default User.init()