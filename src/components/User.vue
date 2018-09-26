<template>
  <div v-if="user" class="text-center layout-padding">
    <h3>{{user.name}}</h3>
    <div v-if="user.societies">
      <h4><b>Societies</b></h4>
      <p  v-for="society in user.societies.full" :key="society.id">{{society.society}} ({{society.pivot.permission}})</p>
    </div>
    <div v-if="user.circuits">
      <h4><b>Circuits</b></h4>
      <p v-for="circuit in user.circuits.full" :key="circuit.id">{{circuit.circuit}} ({{circuit.pivot.permission}})</p>
    </div>
    <div v-if="user.districts">
      <h4><b>Districts</b></h4>
      <p v-for="district in user.districts.full" :key="district.id">{{district.district}} ({{district.pivot.permission}})</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/users/' + this.$route.params.id)
      .then((response) => {
        this.user = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
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
