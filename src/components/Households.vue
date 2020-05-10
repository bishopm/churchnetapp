<template>
  <div class="q-ma-md">
    <p class="caption" v-if="message">{{$message}}</p>
    <q-list v-if="individuals" class="no-border">
      <p class="caption text-center">Search for people</p>
      <societyfilter @altered="searchdb" initial="all" :showme="showme()"></societyfilter>
      <q-input outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="Search by first name, surname or cellphone">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item v-for="individual in individuals" :key="individual.id" :to="'/households/' + individual.household_id">
        <span class="text-bold">
          {{individual.surname}}, {{individual.firstname}}
        </span>
        <span class="q-pl-sm text-weight-thin">({{individual.household.addressee}})</span>
        <span class="q-ml-md text-weight-thin" v-if="bypass">{{individual.household.society.society}} ({{individual.household.society.circuit.circuit}})</span>
        <span class="q-ml-md text-weight-thin" v-else-if="$store.state.user.societies.keys.length > 0">({{individual.household.society.society}})</span>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[17, 12]">
      <q-btn round color="primary" size="sm" @click="addHousehold" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
export default {
  data () {
    return {
      individuals: [],
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
              this.individuals = response.data
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
