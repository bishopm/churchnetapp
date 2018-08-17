<template>
  <div class="text-center q-mt-lg">
    <p class="caption">Welcome!</p>
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
      return this.$store.state.user
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
