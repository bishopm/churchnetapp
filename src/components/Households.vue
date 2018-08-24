<template>
  <div class="layout-padding">
    <p class="caption" v-if="message">{{$message}}</p>
    <q-list class="no-border">
      <p class="caption text-center">All households</p>
      <societyfilter @altered="searchdb" :showme="showme()"></societyfilter>
      <q-search ref="search" class="q-my-md" @input="searchdb" v-model="search" placeholder="search by addressee" />
      <q-item v-if="households" v-for="household in households" :key="household.id" :to="'/households/' + household.id">
        {{household.addressee}}
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addHousehold" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
export default {
  data () {
    return {
      households: [],
      search: '',
      message: ''
    }
  },
  components: {
    'societyfilter': societyfilter
  },
  methods: {
    addHousehold () {
      this.$router.push({name: 'householdform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    searchdb () {
      if (this.$store.state.user.societies.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        if (this.search.length > 1) {
          this.$q.loading.show()
          this.$axios.post(this.$store.state.hostname + '/households/search',
            {
              search: this.search,
              societies: this.$store.state.user.societies.keys
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
