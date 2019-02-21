<template>
  <div v-if="society" class="text-center layout-padding">
    <h3>
      {{society.society}} <q-icon v-if="perm === 'admin'" class="cursor-pointer" @click.native="editSociety()" name="fas fa-edit"></q-icon>
    </h3>
    <p v-for="service in society.services" :key="service.id">{{service.servicetime}} ({{service.language}})
      <q-icon v-if="perm === 'edit'" class="cursor-pointer" @click.native="editService(service.id)" name="fas fa-edit"></q-icon>
    </p>
    <p v-if="noservices">No services have been added yet</p>
    <q-btn v-if="perm === 'edit'" @click="addService()" color="primary">Add a service</q-btn>
    <div v-if="society.website"><a target="_blank" :href="websiteurl">{{society.website}}</a></div>
    <div id="map" class="q-mt-md"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      society: {},
      noservices: false,
      map: null,
      marker: null,
      perm: ''
    }
  },
  methods: {
    initMap () {
      this.$mapbox.accessToken = 'pk.eyJ1IjoiYmlzaG9wbSIsImEiOiJjanNjenJ3MHMwcWRyM3lsbmdoaDU3ejI5In0.M1x6KVBqYxC2ro36_Ipz_w'
      var map = new this.$mapbox.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v9', // stylesheet location
        center: [this.society.location.longitude, this.society.location.latitude], // starting position
        zoom: 13 // starting zoom
      })
      map.addControl(new this.$mapbox.FullscreenControl())
      var popup = new this.$mapbox.Popup({ offset: 25 })
        .setText(this.society.society + ' Methodist Church')
      new this.$mapbox.Marker({ color: '#4d7227' })
        .setLngLat([this.society.location.longitude, this.society.location.latitude])
        .setPopup(popup)
        .addTo(map)
    },
    editSociety () {
      this.$router.push({name: 'societyform', params: { society: JSON.stringify(this.society), action: 'edit' }})
    },
    addService () {
      this.$router.push({name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'add' }})
    },
    editService (id) {
      this.$router.push({name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'edit', service: id }})
    }
  },
  async mounted () {
    await this.$google()
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    var cs = this.$route.params.id.split('_')
    this.$axios.get(process.env.API + '/circuits/' + cs[0] + '/societies/' + cs[1])
      .then((response) => {
        this.society = response.data
        if (!this.society.services.length) {
          this.noservices = true
        }
        this.perm = this.$store.state.user.societies[this.society.id]
        if (this.society.website) {
          if ((this.society.website) && (!this.society.website.includes('http'))) {
            this.websiteurl = 'http://' + this.society.website
          } else {
            if (this.society.website) {
              this.websiteurl = this.society.website
            }
          }
        }
        this.initMap()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
#map {
  text-align:left;
  height: 300px;
}
</style>
