<template>
  <div>
    <p class="caption text-center">Guest preachers</p>
    <circuitselect class="q-mx-md" @altered="searchdb" :showme="2" initial="all" :perms="['editor','admin']"></circuitselect>
    <q-list v-if="guests" class="no-border">
      <q-search ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by surname" />
      <q-item v-for="guest in guests" :key="guest.id">
        {{guest.person.individual.surname}}, {{guest.person.individual.title}} {{guest.person.individual.firstname}}
        <q-chip class="q-ml-md" v-if="guest.active !== 'yes'" color="grey">inactive</q-chip>
      </q-item>
    </q-list>
    <p class="q-ma-md" v-if="!guests">No guest preachers have been added to this circuit</p>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addPerson" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
export default {
  data () {
    return {
      guests: [],
      search: ''
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    addPerson () {
      this.$router.push({name: 'guestform', params: { action: 'add' }})
    },
    searchdb () {
      if (this.$store.state.user.circuits.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/guests',
          {
            search: this.search,
            circuit: this.$store.state.select
          })
          .then(response => {
            this.guests = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  mounted () {
    this.searchdb()
  }

}
</script>

<style>
</style>
