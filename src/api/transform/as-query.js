function toQuery (params, prefix) {
  const query = Object.keys(params).map((key) => {
    const value = params[key]

    if (params.constructor === Array) {
      key = `${prefix}[]`
    } else if (params.constructor === Object) {
      key = (prefix ? `${prefix}[${key}]` : key)
    }

    if (typeof value === 'object') {
      return toQuery(value, key)
    } else {
      return `${key}=${encodeURIComponent(value)}`
    }
  })

  return [].concat.apply([], query).join('&')
}

export default function (action) {
  if (action.request.method === 'GET' && action.request.body) {
    const query = toQuery(action.request.body)

    action.url = action.url.concat('?', query)
    action.request.body = null
  }
}
