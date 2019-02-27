<template>
  <div style="width:100%; height:300px;">
    <l-map ref="map" :zoom="zoom" :center="center" :maxZoom="maxZoom" style="height: 300px; width: 100%" @click="setMarkerPosition">
      <l-control-layers />
      <l-control position="bottomright" >
        <q-btn icon="fa fa-crosshairs" round small color="black" @click="goLocation()"/>
      </l-control>
      <l-tile-layer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name" :visible="tileProvider.visible" :url="tileProvider.url" :attribution="tileProvider.attribution" :token="token" :options="tileProvider.options" layerType="base"/>
      <l-marker :lat-lng="marker" :icon="icon" :draggable="dragme">
        <l-popup>{{popuplabel}}</l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LWMSTileLayer, LControlLayers, LControl, LControlAttribution, LMarker, LPopup } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  data () {
    return {
      name: 'leafletmap',
      tileProviders: [
        {
          name: 'Standard',
          visible: true,
          attribution: '',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {}
        },
        {
          name: 'Satellite',
          visible: false,
          attribution: '',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {}
        }
      ],
      token: 'pk.eyJ1IjoiYmlzaG9wbSIsImEiOiJjanNjenJ3MHMwcWRyM3lsbmdoaDU3ejI5In0.M1x6KVBqYxC2ro36_Ipz_w',
      zoom: 13,
      maxZoom: 20,
      center: [this.latitude, this.longitude],
      bounds: null,
      marker: L.latLng(this.latitude, this.longitude),
      icon: null
    }
  },
  props: ['latitude', 'longitude', 'popuplabel', 'editable'],
  components: {
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-wms-tile-layer': LWMSTileLayer,
    'l-popup': LPopup,
    LControlLayers,
    LControl,
    LControlAttribution,
    LMarker
  },
  computed: {
    dragme () {
      if (this.editable === 'yes') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    },
    setMarkerPosition (event) {
      if (this.editable === 'yes') {
        // console.log(event.latlng)
        this.marker = L.latLng(event.latlng.lat, event.latlng.lng)
        this.$emit('newlng', event.latlng.lng.toString())
        this.$emit('newlat', event.latlng.lat.toString())
        // console.log(center)
        // console.log(this.$refs.map.mapObject)
        this.$refs.map.mapObject.eachLayer(layer => {
          // console.log('name', layer) // undefined
        })
      }
    },
    goLocation () {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.noGeoLocation)
    },
    displayLocationInfo (position) {
      const lng = position.coords.longitude
      const lat = position.coords.latitude

      // this.marker = L.latLng(lat, lng)
      this.center = [lat, lng]
      // console.log(lat)
      // console.log(lng)
    },
    noGeoLocation (error) {
      alert('No funciona' + error.message)
    }
  },
  mounted () {
    this.icon = L.icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconSize: [24, 36],
      iconAnchor: [12, 36]
    })
  }
}
</script>

<style>
</style>
