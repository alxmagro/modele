export default function (time, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => callback()
      ? resolve()
      : reject(new Error('Stub error')), time)
  })
}
