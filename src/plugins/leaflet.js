import { LMap, LTileLayer, LWMSTileLayer, LControlLayers } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

export default ({ Vue }) => {
  Vue.prototype.$LMap = LMap
  Vue.prototype.$LTileLayer = LTileLayer
  Vue.prototype.$LWMSTileLayer = LWMSTileLayer
  Vue.prototype.$LControlLayers = LControlLayers
}
