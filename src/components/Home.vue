<template>
  <div class="text-center q-mt-lg" v-if="user">
    <p class="caption">Welcome <b>{{user.name}}</b></p>
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
    this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/users/' + localStorage.getItem('CHURCHNET_user_id'))
      .then((response) => {
        this.$store.commit('setUser', response.data)
        this.user = response.data
        if (this.user.societies) {
          this.$store.commit('setSocieties', this.user.societies)
        }
        if (this.user.circuits) {
          this.$store.commit('setCircuits', this.user.circuits)
        }
        if (this.user.districts) {
          this.$store.commit('setDistricts', this.user.districts)
        }
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
