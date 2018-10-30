\<template>
  <div class="layout-padding">
    <div class="text-center" v-if="roster">
      <p v-if="roster.society" class="caption">{{roster.name}} <small>{{roster.society.society}}</small></p>
      <p class="text-italic">{{roster.message}}</p>
      <q-table v-if="columns" dense :data="rows" :columns="columns" :pagination.sync="paginationControl" hide-bottom row-key="groups.id">
        <q-td slot='body-cell' slot-scope='props' :props='props' @click.native="editrosteritem(props.row[props.col.field], props.row, props.col)">
          <div v-if="props.col.field === 'groups'">
            <b>{{props.row[props.col.field].label}}</b>
          </div>
          <div v-else v-html="props.row[props.col.field].label"></div>
        </q-td>
      </q-table>
      <q-modal minimized v-model="modalopen" content-css="padding: 50px">
        <h4>{{form.grouplabel}}</h4>
        <q-input readonly float-label="Roster date" v-model="form.rosterdate"/>
        <div class="q-my-md">
          <q-select float-label="Individual" v-model="form.individual_id" :options="indivOptions"/>
        </div>
        <q-btn class="q-mt-md" color="primary" @click="savechanges()" label="Save" />
        <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
      </q-modal>
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
      columns: [],
      form: {
        individual_id: '',
        rostergroup_id: '',
        rowndx: '',
        colndx: ''
      },
      modalopen: false,
      indivOptions: []
    }
  },
  mounted () {
    this.$q.loading.show()
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rosters/' + this.$route.params.id + '/' + this.$route.params.year + '/' + this.$route.params.month)
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
  },
  methods: {
    editrosteritem (record, row, col) {
      if (this.$store.state.user.societies[this.roster.society.id] === 'view') {
        this.$q.notify('Sorry! You are not permitted to edit this roster')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.get(process.env.API + '/groups/' + row.groups.id)
          .then(response => {
            this.indivOptions = []
            for (var ikey in response.data.individuals) {
              var newitem = {
                label: response.data.individuals[ikey].surname + ', ' + response.data.individuals[ikey].firstname,
                display: response.data.individuals[ikey].firstname.substr(0, 1) + ' ' + response.data.individuals[ikey].surname,
                value: parseInt(response.data.individuals[ikey].id)
              }
              this.indivOptions.push(newitem)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.form.rosterdate = col.label
        this.form.individual_id = parseInt(record.id)
        this.form.rostergroup_id = row.groups.rostergroup_id
        this.form.grouplabel = row.groups.label
        this.form.rowndx = row.__index
        this.form.colndx = col.field
        this.modalopen = true
      }
    },
    savechanges () {
      this.$axios.post(process.env.API + '/rosteritems',
        {
          rostergroup_id: this.form.rostergroup_id,
          rosterdate: this.form.rosterdate,
          individual_id: this.form.individual_id
        })
        .then(response => {
          for (var lll in this.indivOptions) {
            if (this.indivOptions[lll].value === this.form.individual_id) {
              this.rows[this.form.rowndx][this.form.colndx].label = this.indivOptions[lll].display
            }
          }
        })
        .catch(function (error) {
          this.error = error
        })
      this.modalopen = false
    }
  }
}
</script>

<style>
</style>
