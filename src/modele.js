import axios from 'axios'
import Resource from './structures/resource'
import Member from './structures/member'
import Rule from './validation/structures/rule'

export default {
  Resource,
  Member,
  Rule,
  globals: {
    axios
  }
}
