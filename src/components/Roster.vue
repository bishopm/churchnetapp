\<template>
  <div class="layout-padding">
    <div class="text-center" v-if="roster">
      <p v-if="roster.society" class="caption">{{roster.name}} <small>{{roster.society.society}}</small></p>
      <p class="text-italic">{{roster.message}}</p>
      <q-table v-if="columns" dense :data="rows" :columns="columns" :pagination.sync="paginationControl" hide-bottom>
        <q-td slot='body-cell' slot-scope='props' :props='props'>
          <div>
            <b>{{JSON.parse(props)}}</b>
          </div>
        </q-td>
      </q-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roster: {},
      paginationControl: { rowsPerPage: 0 },
      rows: [],
      columns: []
    }
  },
  mounted () {
    this.$q.loading.show()
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(this.$store.state.hostname + '/rosters/' + this.$route.params.id + '/' + this.$route.params.year + '/' + this.$route.params.month)
        .then(response => {
          this.roster = response.data.roster
          this.columns = response.data.columns
          this.rows = response.data.rows
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  }

}
</script>

<style>
</style>
