<template>
  <div class="text-center q-mt-lg" v-if="user()">
    <p class="caption">Welcome! &nbsp;<span><b>{{$store.state.user.name}}</b></span></p>
    <h4 v-if="$store.state.user.districts.length">District permissions</h4>
    <p v-for="district in $store.state.user.districts" :key="district.id">
      {{district}}
    </p>
    <h4 v-if="$store.state.user.circuits.length">Circuit permissions</h4>
    <p v-for="circuit in $store.state.user.circuits" :key="circuit.id">
      {{circuit.circuit}} ({{circuit.pivot.permission}})
    </p>
    <h4 v-if="$store.state.user.societies.length">Society permissions</h4>
    <p v-for="society in $store.state.user.societies" :key="society.id">
      {{society.society}} ({{society.pivot.permission}})
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      circs: [],
      socs: []
    }
  },
  methods: {
    user () {
      if (this.$store.state.user) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/users/' + localStorage.getItem('CHURCHNET_user_id'))
      .then((response) => {
        this.$store.commit('setUser', response.data)
        for (var skey in this.$store.state.user.societies) {
          this.socs.push(this.$store.state.user.societies[skey].id.toString())
        }
        this.$store.commit('setSocieties', this.socs)
        for (var ckey in this.$store.state.user.circuits) {
          this.circs.push(this.$store.state.user.circuits[ckey].id.toString())
        }
        this.$store.commit('setCircuits', this.circs)
      })
      .catch(function (error) {
        console.log(error)
        localStorage.removeItem('CHURCHNET_Token')
        this.$router.push({ name: 'login' })
      })
  }
}
</script>

<style>
</style>
