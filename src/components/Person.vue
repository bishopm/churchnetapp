<template>
  <div v-if="society" class="text-center layout-padding">
    <h3>{{society.society}}</h3>
    <p v-for="service in society.services" :key="service.id">{{service.servicetime}} ({{service.language}})</p>
    <div v-if="society.website"><a target="_blank" :href="society.websiteurl">{{society.website}}</a></div>
    <div id="map" class="q-mt-md"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      society: {},
      map: null,
      marker: null
    }
  },
  methods: {
    initMap () {
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(this.society.latitude), lng: parseFloat(this.society.longitude)},
        zoom: 14
      })
      this.marker = new window.google.maps.Marker({position: {lat: parseFloat(this.society.latitude), lng: parseFloat(this.society.longitude)}, map: this.map})
    }
  },
  async mounted () {
    await this.$google()
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    var cs = this.$route.params.id.split('_')
    this.$axios.get(this.$store.state.hostname + '/circuits/' + cs[0] + '/societies/' + cs[1])
      .then((response) => {
        this.society = response.data
        if (this.society.website) {
          if ((this.society.website) && (!this.society.website.includes('http'))) {
            this.society.websiteurl = 'http://' + this.society.website
          } else {
            if (this.society.website) {
              this.society.websiteurl = this.society.website
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
  text-align:center;
  height: 300px;
  width: 100%;
}
</style>
