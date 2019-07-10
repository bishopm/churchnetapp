<template>
  <div class="q-ma-md">
    <p class="caption" v-if="message">{{$message}}</p>
    <q-list v-if="households" class="no-border">
      <p class="caption text-center">All households</p>
      <societyfilter @altered="searchdb" initial="all" :showme="showme()"></societyfilter>
      <q-input outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="Search by addressee">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item v-for="household in households" :key="household.id" :to="'/households/' + household.id">
        {{household.addressee}}
        <span class="q-ml-md text-weight-thin" v-if="bypass">{{household.society.society}} ({{household.society.circuit.circuit}})</span>
        <span class="q-ml-md text-weight-thin" v-else-if="$store.state.user.societies.keys.length > 0">({{household.society.society}})</span>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" size="sm" @click="addHousehold" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
export default {
  data () {
    return {
      households: [],
      search: '',
      message: '',
      bypass: false
    }
  },
  components: {
    'societyfilter': societyfilter
  },
  methods: {
    addHousehold () {
      this.$router.push({ name: 'householdform', params: { action: 'add', scope: 'society' } })
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    searchdb () {
      if (this.$store.state.user.societies.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        if (this.search.length > 1) {
          this.$q.loading.show()
          this.$axios.post(process.env.API + '/households/search',
            {
              search: this.search,
              societies: this.$store.state.societyfilter,
              scope: this.bypass
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
