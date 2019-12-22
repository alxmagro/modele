import Model from 'core/model'
import axios from 'axios'

export default class Post extends Model {
  static options () {
    return {
      ...super.options(),

      baseURL: '/users/:userId/posts[/:id]'
    }
  }

  static request (config) {
    return axios(config)
  }
}
