import Resource from './structures/resource'
import Member from './structures/member'

import AxiosAdapter from './adapters/axios-adapter'

export default {
  Resource,
  Member,
  adapters: {
    http: new AxiosAdapter()
  }
}
