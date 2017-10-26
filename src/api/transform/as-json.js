export default function (action) {
  if (!action.request.headers['Content-Type']) {
    action.request.headers['Content-Type'] = 'application/json;charset=utf-8'

    if (action.request.body) {
      action.request.body = JSON.stringify(action.request.body)
    }
  }
}
