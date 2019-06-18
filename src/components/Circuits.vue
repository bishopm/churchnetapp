<template>
  <div class="q-ma-md">
    <q-list v-if="circuits" class="no-border">
      <p class="caption text-center">All circuits</p>
      <districtfilter @altered="searchdb" :showme="showme()"></districtfilter>
      <q-input outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="Search by circuit name">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item v-for="circuit in circuits" :key="circuit.id" :to="'/circuits/' + circuit.id">
        {{circuit.circuitnumber}} {{circuit.circuit}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" size="sm" @click="addSociety" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import districtfilter from './Districtfilter'
export default {
  data () {
    return {
      circuits: [],
      search: ''
    }
  },
  components: {
    'districtfilter': districtfilter
  },
  methods: {
    addSociety () {
      this.$router.push({ name: 'circuitform', params: { action: 'add' } })
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    searchdb () {
      if (this.$store.state.user.circuits.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/circuits/search',
          {
            search: this.search,
            districts: this.$store.state.districtfilter
          })
          .then(response => {
            this.circuits = response.data
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    }
  },
  mounted () {
    this.$refs.search.focus()
    this.$q.loading.show()
    this.searchdb()
  }

}
</script>

<style>
</style>
