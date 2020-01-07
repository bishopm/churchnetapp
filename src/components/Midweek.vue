<template>
  <div>
    <q-list v-if="services" class="no-border">
      <p class="q-mt-md caption text-center">Midweek services</p>
      <circuitselect class="q-mx-md" @altered="searchdb" :perms="['editor','admin']" showme="1"></circuitselect>
      <q-item class="q-mx-md" v-for="service in services" :key="service.id" :to="'/midweek/' + service.circuit_id + '/edit/' + service.id">
        <q-item-section>{{service.description}}</q-item-section>
        <q-item-section>
          <small>{{formatme(service.servicedate)}}</small>
        </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[17, 12]">
      <q-btn size="sm" round color="primary" @click="addMidweek" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
export default {
  data () {
    return {
      services: [],
      search: ''
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    addMidweek () {
      this.$router.push({ name: 'midweekform', params: { action: 'add', circuit: this.$store.state.select } })
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    formatme (datein) {
      var fin = new Date(datein * 1000)
      return fin.toUTCString().substring(4, 22)
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/weekdays/search',
        {
          circuit: this.$store.state.select
        })
        .then(response => {
          this.services = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
  }
}
</script>

<style>
</style>
