<template>
  <div class="layout-padding">
    {{roster}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      roster: {}
    }
  },
  mounted () {
    this.$q.loading.show()
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rosters/' + this.$route.params.id + '/' + this.$route.params.year + '/' + this.$route.params.month)
        .then(response => {
          this.roster = response.data.roster
          this.columns = response.data.columns
          this.rows = response.data.rows
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
