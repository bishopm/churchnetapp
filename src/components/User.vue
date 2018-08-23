<template>
  <div v-if="user" class="text-center layout-padding">
    {{perm}}
    <h4>{{user.name}}</h4>
    <p v-for="society in user.societies" :key="society.id">{{society.society}} ({{society.pivot.permission}})</p>
    <p v-for="circuit in user.circuits" :key="circuit.id">{{circuit.circuit}} ({{circuit.pivot.permission}})</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      perm: ''
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/users/' + this.$route.params.id)
      .then((response) => {
        this.user = response.data
        this.perm = this.$store.state.user.circuits.find(circuit => circuit.id === 164).pivot.permission
        this.initMap()
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    editHousehold () {
      this.$router.push({name: 'householdform', params: { id: this.$route.params.id, action: 'edit' }})
    },
    editIndividual (individual) {
      this.$router.push({name: 'individualform', params: { individual: individual, action: 'edit' }})
    },
    async initMap () {
      await this.$google()
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(this.household.latitude), lng: parseFloat(this.household.longitude)},
        zoom: 15
      })
      this.marker = new window.google.maps.Marker({position: {lat: parseFloat(this.household.latitude), lng: parseFloat(this.household.longitude)}, map: this.map})
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
</style>
