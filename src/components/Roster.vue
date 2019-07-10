<template>
  <div class="q-ma-md">
    <div class="text-center" v-if="roster">
      <div v-if="roster.society" class="caption">
        <q-btn class="q-mr-md bg-secondary text-white" label="<" @click="backmonth()"></q-btn>
        {{roster.name}} <small>{{roster.society.society}}</small>
        <q-btn class="q-ml-md bg-secondary text-white" label=">" @click="forwardmonth()"></q-btn>
        <div>
          <q-btn class="q-ma-sm" @click="viewroster">View roster</q-btn>
          <q-btn class="q-ma-sm" @click="preview">Preview Messages</q-btn>
        </div>
      </div>
      <p class="text-italic">{{roster.message}}</p>
      <q-table v-if="columns" dense :data="rows" :columns="columns" :pagination.sync="paginationControl" hide-bottom row-key="groups.id">
        <q-td slot='body-cell' slot-scope='props' :props='props' @click.native="editrosteritem(props.row[props.col.field], props.row, props.col)">
          <div v-if="props.col.field === 'groups'">
            <b>{{props.row[props.col.field].label}}</b>
          </div>
          <div v-else>
            <span v-for="person in props.row[props.col.field].people" :key="person.id">{{person.label}}<br></span>
          </div>
        </q-td>
      </q-table>
      <q-dialog minimized v-model="modalopen" content-css="padding: 50px">
        <q-card class="q-pa-md">
          <p class="text-center header">{{form.grouplabel}}</p>
          <q-input readonly label="Roster date" v-model="form.rosterdate"/>
          <div class="q-my-md">
            <q-select v-if="checkpeople" label="Individual" multiple v-model="form.individuals" :options="indivOptions" map-options emit-value clearable/>
            <q-select v-else label="Individual" v-model="form.indivint" :options="indivOptions" map-options emit-value clearable/>
          </div>
          <q-btn class="q-mt-md" color="primary" @click="savechanges()" label="Save" />
          <q-btn class="q-mt-md q-ml-md" color="secondary" @click="resetmodal" label="Cancel" />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { openURL } from 'quasar'
export default {
  data () {
    return {
      roster: {},
      paginationControl: { rowsPerPage: 0 },
      rows: [],
      columns: [],
      newmonth: '',
      newyear: '',
      form: {
        indivint: '',
        individuals: [],
        rostergroup_id: '',
        rowndx: '',
        colndx: '',
        maxpeople: ''
      },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      modalopen: false,
      indivOptions: []
    }
  },
  computed: {
    checkpeople () {
      if (this.form.maxpeople > 1) {
        return true
      } else {
        return false
      }
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
    backmonth () {
      var ndx = this.months.indexOf(this.$route.params.month)
      if (ndx !== 0) {
        this.newmonth = this.months[ndx - 1]
        this.newyear = this.$route.params.year
      } else {
        this.newmonth = this.months[11]
        this.newyear = this.$route.params.year - 1
      }
      this.$router.push({ name: 'roster', params: { year: this.newyear, month: this.newmonth } })
    },
    forwardmonth () {
      var ndx = this.months.indexOf(this.$route.params.month)
      if (ndx !== 11) {
        this.newmonth = this.months[ndx + 1]
        this.newyear = this.$route.params.year
      } else {
        this.newmonth = this.months[0]
        this.newyear = this.$route.params.year + 1
      }
      this.$router.push({ name: 'roster', params: { year: this.newyear, month: this.newmonth } })
    },
    resetmodal () {
      this.form.individuals = []
      this.form.indivint = ''
      this.modalopen = false
    },
    viewroster () {
      openURL(process.env.WEB + '/admin/rosters/' + this.$route.params.id + '/report/' + this.$route.params.year + '/' + this.$route.params.month)
    },
    preview () {
      this.$router.push({ name: 'rostermessages', params: { roster: this.$route.params.id, year: this.$route.params.year, month: this.$route.params.month } })
    },
    editrosteritem (record, row, col) {
      if (this.$store.state.user.societies[this.roster.society.id] === 'view') {
        this.$q.notify('Sorry! You are not permitted to edit this roster')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.get(process.env.API + '/groups/' + row.groups.id)
          .then(response => {
            this.indivOptions = []
            for (var ikey in response.data.members) {
              var newitem = {
                label: response.data.members[ikey].firstname + '&nbsp;<b>' + response.data.members[ikey].surname + '</b>',
                display: response.data.members[ikey].firstname.substr(0, 1) + ' ' + response.data.members[ikey].surname,
                value: parseInt(response.data.members[ikey].id)
              }
              this.indivOptions.push(newitem)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.form.rosterdate = col.label
        this.form.rostergroup_id = row.groups.rostergroup_id
        this.form.maxpeople = row.groups.maxpeople
        for (var pkey in record.people) {
          if (pkey < this.form.maxpeople) {
            this.form.individuals.push(record.people[pkey].id)
          }
        }
        if ((this.form.maxpeople === 1) && (record.people.length)) {
          this.form.indivint = record.people[0].id
        }
        this.form.grouplabel = row.groups.label
        this.form.rowndx = row.__index
        this.form.colndx = col.field
        this.modalopen = true
      }
    },
    savechanges () {
      if (this.form.individuals.length <= this.form.maxpeople) {
        this.form.individuals = []
        if (this.form.indivint) {
          this.form.individuals.push(this.form.indivint)
        }
        this.form.indivint = ''
        this.$axios.post(process.env.API + '/rosteritems',
          {
            rostergroup_id: this.form.rostergroup_id,
            rosterdate: this.form.rosterdate,
            individuals: this.form.individuals
          })
          .then(response => {
            var indarray = response.data.individuals.split(',').map(function (item) {
              return parseInt(item, 10)
            })
            this.rows[this.form.rowndx][this.form.colndx].people = []
            for (var lll in this.indivOptions) {
              if (indarray.indexOf(this.indivOptions[lll].value) !== -1) {
                var newitem = {
                  label: this.indivOptions[lll].display,
                  id: this.indivOptions[lll].value
                }
                this.rows[this.form.rowndx][this.form.colndx].people.push(newitem)
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        this.resetmodal()
      } else {
        this.$q.notify('Sorry, only ' + this.form.maxpeople + ' names for this category!')
      }
    }
  }
}
</script>

<style>
</style>
