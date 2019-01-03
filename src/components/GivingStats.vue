<template>
  <div class="layout-padding">
    <p class="caption text-center">Giving Statistics <small>{{society}}</small></p>
    <q-table v-if="columns.length" :data="rows" :columns="columns" :pagination.sync="pagination" hide-bottom>
      <q-td slot='body-cell' slot-scope='props' :props='props'>
        <span v-if="props.col.field === 'Month'"><b>{{props.row[props.col.field]}}</b></span>
        <span v-else-if="props.col.field !== 'id'">{{props.row[props.col.field]}}</span>
      </q-td>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      society: '',
      totals: [],
      rows: [],
      columns: [],
      pagination: {
        rowsPerPage: 12,
        sortBy: 'id'
      }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/givingstats',
      {
        society: this.$route.params.society
      })
      .then(response => {
        this.columns = response.data.columns
        this.society = response.data.society
        for (var pndx in response.data.rows) {
          this.rows.push(response.data.rows[pndx])
        }
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
  }

}
</script>

<style>
</style>
