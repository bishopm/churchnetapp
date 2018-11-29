<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">Circuit preachers</p>
      <circuitfilter class="q-mx-md" @altered="searchdb" :showme="showme()" initial="all"></circuitfilter>
      <q-search ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by surname" />
      <q-item v-if="preachers" v-for="preacher in preachers" :key="preacher.id" :to="'/preachers/' + preacher.person.id">
        {{preacher.surname}}, {{preacher.title}} {{preacher.firstname}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addPerson" class="fixed" icon="add"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      preachers: [],
      search: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    addPerson () {
      this.$router.push({name: 'preacherform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    searchdb () {
      if (this.$store.state.user.circuits.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/people/search',
          {
            search: this.search,
            circuits: this.$store.state.circuitfilter
          })
          .then(response => {
            this.preachers = response.data.people
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
