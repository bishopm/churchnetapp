<template>
  <div v-if="person" class="text-center layout-padding">
    <p class="caption">{{person.title}} {{person.firstname}} {{person.surname}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      person: {}
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/people/' + this.$route.params.id)
      .then((response) => {
        this.person = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
</style>
