<template>
  <div>
    <p class="caption text-center">All payments</p>
    <societyselect class="q-mx-md" @altered="searchdb" :perms="['editor','admin']" :showme="1" initial="all"></societyselect>
    <q-table :data="rows" :columns="columns" :pagination.sync="pagination">
      <q-td slot='body-cell' slot-scope='props' :props='props' @click.native="editPayment(props.row)">
        <div v-html="props.row[props.col.field]"></div>
      </q-td>
    </q-table>
    <q-page-sticky expand position="top-right" :offset="[92, 32]">
      <q-btn color="primary" @click="givingStats" class="fixed" icon="fas fa-chart-bar"/>
    </q-page-sticky>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addPayment" class="fixed" icon="fas fa-plus"/>
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
    editPayment (row) {
      this.$router.push({name: 'givingform', params: { action: 'edit', society: this.$store.state.select, id: row['id'] }})
    },
    givingStats () {
      this.$router.push({name: 'givingstats', params: { society: this.$store.state.select }})
    },
    searchdb () {
      this.$q.loading.show()
      this.rows = []
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/payments/' + this.$store.state.select)
        .then(response => {
          for (var pndx in response.data) {
            var newitem = {
              id: response.data[pndx].id,
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
