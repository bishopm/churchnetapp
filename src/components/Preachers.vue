<template>
  <div>
    <q-list v-if="preachers">
      <p class="caption text-center">Circuit preachers</p>
      <circuitfilter class="q-mx-md" @altered="searchdb" :showme="showme()" initial="all"></circuitfilter>
      <q-input class="q-ma-md" outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search by surname">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item class="q-ma-sm" v-for="preacher in preachers" :key="preacher.id" :to="'/preachers/edit/' + JSON.stringify(preacher)">
        {{preacher.surname}}, {{preacher.title}} {{preacher.firstname}}
        <q-badge dense class="q-ml-md" v-if="preacher.person.active === 'no'" color="grey">inactive</q-badge>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 19]">
      <q-btn size="sm" round color="primary" @click="addPerson" icon="fas fa-plus"/>
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
      this.$router.push({ name: 'preacherform', params: { action: 'add' } })
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
