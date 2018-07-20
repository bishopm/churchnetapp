let promise = null

export default ({ app, router, Vue }) => {
  let
    id = 'google-cdn',
    url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBQmfbfWGd1hxfR1sbnRXdCaQ5Mx5FjUhA'

  Vue.prototype.$google = function () {
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          console.error(`Error loading ${url} async: ${id} is not unique`)
          return
        }
        let script = document.createElement('script')
        script.src = url
        script.async = true
        script.id = id
        script.onload = () => {
          resolve()
        }
        script.onerror = (err) => {
          reject(err)
        }
        document.body.appendChild(script)
      })
    }
    return promise
  }
}
