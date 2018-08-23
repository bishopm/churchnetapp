<template>
  <div class="text-center layout-padding">
    <circuitselect @setcircuit="sc(circuits)" :perms="['edit','admin']"></circuitselect>
    <h3>Add a new society</h3>
    <small>{{circuit.name}}</small>
    <div id="map" class="q-mt-md"></div>
    <form>
      <q-field label="Name of society" class="q-mt-md">
        <q-input name="society" v-model="society.society"/>
      </q-field>
      <q-field label="Address">
        <q-input name="address" v-model="society.address"/>
      </q-field>
      <q-field label="Website">
        <q-input name="website" v-model="society.website"/>
      </q-field>
      <q-btn @click="addMe" class="q-mt-md" label="OK"></q-btn>
    </form>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
export default {
  data () {
    return {
      society: {},
      marker: {},
      map: {}
    }
  },
  computed: {
    circuit () {
      return 164
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    sc (circs) {
      console.log(circs)
    },
    addMe () {
      this.$q.loading.show()
      this.$axios.post(this.$store.state.hostname + '/methodist/addsociety',
        {
          society: this.society.society,
          address: this.society.address,
          website: this.society.website,
          latitude: localStorage.getItem('CHURCHNET_newLat'),
          longitude: localStorage.getItem('CHURCHNET_newLng'),
          circuit_id: this.$store.state.circuitid,
          individual_id: this.$store.state.individual.id
        })
        .then(response => {
          this.$q.loading.hide()
          this.$router.push({ name: 'society', params: { id: response.data.id } })
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    initMap () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          var latlng = new window.google.maps.LatLng(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          localStorage.setItem('CHURCHNET_newLat', latlng.lat())
          localStorage.setItem('CHURCHNET_newLng', latlng.lng())
          this.map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: latlng
          })
          this.marker = new window.google.maps.Marker({
            position: latlng,
            map: this.map,
            draggable: true
          })
          this.marker.addListener('dragend', function () {
            localStorage.setItem('CHURCHNET_newLat', this.position.lat())
            localStorage.setItem('CHURCHNET_newLng', this.position.lng())
          })
        })
      } else {
        console.log('Browser cannot')
      }
    }
  },
  async mounted () {
    localStorage.removeItem('CHURCHNET_newLat')
    localStorage.removeItem('CHURCHNET_newLng')
    await this.$google()
    this.initMap()
  }
}
</script>

<style>
#map {
  text-align:center;
  height: 300px;
  width: 100%;
}
</style>
