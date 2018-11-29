<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">All societies</p>
      <circuitfilter @altered="searchdb" :showme="showme()" initial="all"></circuitfilter>
      <q-search ref="search" class="q-my-md" @input="searchdb" v-model="search" placeholder="search by society name" />
      <q-item v-if="societies" v-for="society in societies" :key="society.id" :to="'/societies/' + society.circuit_id + '_' + society.id">
        {{society.society}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addSociety" class="fixed" icon="add"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      societies: [],
      search: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    addSociety () {
      this.$router.push({name: 'societyform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    searchdb () {
      if (this.$store.state.user.societies.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/societies/search',
          {
            search: this.search,
            circuits: this.$store.state.circuitfilter
          })
          .then(response => {
            this.societies = response.data
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
