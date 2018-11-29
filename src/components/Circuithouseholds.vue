<template>
  <div class="layout-padding">
    <p class="caption" v-if="message">{{$message}}</p>
    <q-list class="no-border">
      <p class="caption text-center">All households</p>
      <circuitfilter @altered="searchdb" :showme="showme()"></circuitfilter>
      <q-search ref="search" class="q-my-md" @input="searchdb" v-model="search" placeholder="search by addressee" />
      <q-item v-if="households" v-for="household in households" :key="household.id" :to="'/households/' + household.id">
        {{household.addressee}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addHousehold" class="fixed" icon="add"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      households: [],
      search: '',
      message: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    addHousehold () {
      this.$router.push({name: 'householdform', params: { action: 'add', scope: 'circuit' }})
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    searchdb () {
      if (this.$store.state.user.societies.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        if (this.search.length > 1) {
          this.$q.loading.show()
          this.$axios.post(process.env.API + '/households/search',
            {
              search: this.search,
              circuit: this.$store.state.circuitfilter
            })
            .then(response => {
              this.households = response.data
              this.$q.loading.hide()
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      } else {
        this.message = 'Sorry! You do not have permission to view households'
      }
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
