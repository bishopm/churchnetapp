<template>
  <div class="layout-padding">
    <q-table :title="title" :data="rows" :columns="headers" :pagination.sync="paginationControl" hide-bottom/>
    <q-list class="no-border">
      <q-item v-if="societies" v-for="society in societies" :key="society.id" :to="'/societies/' + society.circuit_id + '_' + society.id">
        {{society.society}}
      </q-item>
    </q-list>
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
import { date } from 'quasar'

export default {
  data () {
    return {
      societies: [],
      headers: [],
      rows: [],
      title: 'Preaching plan: ' + date.formatDate(Date.now(), 'MMMM YYYY'),
      paginationControl: { rowsPerPage: 0 }
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    searchdb () {
      if (this.$store.state.societies) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(this.$store.state.hostname + '/societies/search',
          {
            search: this.search,
            circuits: this.$store.state.circuits
          })
          .then(response => {
            console.log(response.data)
            for (var skey in response.data) {
              var newitem = {
                society: response.data[skey].society,
                align: 'left'
              }
              this.rows.push(newitem)
              this.headers = [
                { label: 'Society', align: 'left', field: 'society' },
                { label: 'Service', align: 'left', field: 'servicetime' },
                { label: '1 Aug', align: 'left' },
                { label: '8 Aug', align: 'left' },
                { label: '15 Aug', align: 'left' },
                { label: '22 Aug', align: 'left' },
                { label: '29 Aug', align: 'left' }
              ]
            }
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
    this.$q.loading.show()
    this.searchdb()
  }

}
</script>

<style>
</style>
