<template>
  <div class="q-my-md">
    <q-list v-if="venues" class="no-border">
      <p class="caption text-center">Venues</p>
      <societyselect @altered="searchdb" class="q-ma-md" :perms="['editor','admin']" showme="showme()"></societyselect>
      <q-input class="q-ma-md" outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search by venue name">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item class="q-mx-md" v-for="venue in venues" :key="venue.id" :to="'/venues/' + venue.id">
        {{venue.venue}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn size="sm" round color="primary" @click="addGroup" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import societyselect from './Societyselect'
export default {
  data () {
    return {
      venues: [],
      search: ''
    }
  },
  components: {
    'societyselect': societyselect
  },
  methods: {
    addGroup () {
      this.$router.push({ name: 'venueform', params: { action: 'add' } })
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    searchdb () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/venues/search',
        {
          search: this.search,
          society: this.$store.state.select
        })
        .then(response => {
          this.venues = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.$refs.search.focus()
    this.searchdb()
  }

}
</script>

<style>
</style>
