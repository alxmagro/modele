import axios from 'axios'
import Resource from './structures/resource'
import Member from './structures/member'

const DEFAULT_OPTIONS = {
  identifier: 'id',
  mutateOnChange: false,
  requestOptions: {},
  routeParameterPattern: /\{([^}]+)\}/,
  routeParameterURL: '$url',
  ruleset: null
}

export default {
  Resource,
  Member,
  globals: {
    axios,
    options: DEFAULT_OPTIONS
  }
}
