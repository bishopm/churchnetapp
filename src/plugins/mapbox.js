import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default ({ Vue }) => {
  Vue.prototype.$mapbox = mapboxgl
}
