import Model from 'core/model'
import { presence, confirmation } from 'validations'
import axios from 'axios'

export default class User extends Model {
  static options () {
    return {
      ...super.options(),

      baseURL: '/users[/:id]'
    }
  }

  static request (config) {
    return axios(config)
  }

  static mutations () {
    return {
      name: (value) => value && value.trim()
    }
  }

  static validation () {
    return {
      name: [
        presence()
      ],
      password: [
        presence({ on: 'create' })
      ],
      passwordConfirmation: [
        confirmation({ with: 'password', if: (user) => user.password})
      ]
    }
  }
}
