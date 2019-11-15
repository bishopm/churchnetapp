<template>
  <div>
    <q-list v-if="bookings" class="no-border">
      <p class="q-mt-md caption text-center">
        Venue
      </p>
      <q-item class="q-mx-sm" v-for="booking in bookings" :key="booking.id" :to="'/booking/' + $route.params.scope + '/edit/' + entity.id + '/' + booking.id">
        {{booking}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round size="sm" color="primary" @click="addBooking" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      venue: {},
      bookings: []
    }
  },
  methods: {
    addBooking () {
      this.$router.push({ name: 'diaryform', params: { action: 'add', scope: this.$route.params.scope, entity: JSON.stringify(this.entity) } })
    },
    formatme (datein) {
      var fin = new Date(datein * 1000)
      return fin.toUTCString().substring(4, 22)
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/venuebookings/' + this.$route.params.id)
        .then(response => {
          this.bookings = response.data.bookings
          this.venue = response.data.venue
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.searchdb()
  }
}
</script>

<style>
</style>
