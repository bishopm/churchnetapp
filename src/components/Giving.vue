<template>
  <div>
    <p class="caption text-center">All payments</p>
    <societyselect class="q-mx-md" @altered="searchdb" :perms="['edit','admin']" :showme="1" initial="all"></societyselect>
    <q-table class="q-mx-md" :pagination.sync="pagination" :data="rows" :columns="columns" row-key="name"/>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addPayment" class="fixed" icon="add"/>
    </q-page-sticky>
  </div>
</template>

<script>
import societyselect from './Societyselect'
export default {
  data () {
    return {
      columns: [
        { name: 'date', required: true, label: 'Date', align: 'left', field: 'paymentdate', sortable: true },
        { name: 'number', required: true, label: 'Giver number', align: 'left', field: 'pgnumber', sortable: true },
        { name: 'amt', required: true, label: 'Amount', align: 'right', field: 'amount', sortable: true }
      ],
      rows: [],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  components: {
    'societyselect': societyselect
  },
  methods: {
    addPayment () {
      this.$router.push({name: 'givingform', params: { action: 'add', society: this.$store.state.select }})
    },
    searchdb () {
      this.$q.loading.show()
      this.rows = []
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/payments/' + this.$store.state.select)
        .then(response => {
          for (var pndx in response.data) {
            var newitem = {
              paymentdate: response.data[pndx].paymentdate,
              pgnumber: response.data[pndx].pgnumber,
              amount: response.data[pndx].amount
            }
            this.rows.push(newitem)
          }
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
