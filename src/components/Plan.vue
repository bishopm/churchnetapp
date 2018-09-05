<template>
  <div class="layout-padding">
    <q-select @input="showplan(planyear,planmonth)" float-label="Circuit" v-model="circuit" :options="circuitOptions"/>
    <q-table v-if="headers" dense :data="rows" :columns="headers" :pagination.sync="paginationControl" hide-bottom>
      <div slot="top" slot-scope="props" class="row flex-center fit">
        <q-btn class="q-mr-md bg-secondary text-white" label="<" @click="backmonth()"></q-btn>Preaching plan: {{monthname}} {{planyear}}<q-btn class="q-ml-md bg-secondary text-white" label=">" @click="forwardmonth()"></q-btn>
      </div>
      <q-td slot='body-cell' slot-scope='props' :props='props' @click.native="editplan(props.row[props.col.field], props.row, headers[1 + parseInt(props.col.field)].label, props.col.field)">
        <div v-if="props.col.field === 'society'">
          <b>{{JSON.parse(props.row[props.col.field]).society}}</b>&nbsp;<small>{{JSON.parse(props.row[props.col.field]).servicetime}}</small>
        </div>
        <div v-else v-html="fixup(props.row[props.col.field])"></div>
      </q-td>
    </q-table>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <h4>{{form.societyname}}</h4>
      <q-input readonly float-label="Service date" v-model="form.servicedate"/>
      <div class="q-my-md">
        <q-select float-label="Preacher" v-model="form.plan.person.id" :options="preacherOptions"/>
      </div>
      <div class="q-my-md">
        <q-select float-label="Service type" v-model="form.plan.tag" :options="labelOptions"/>
      </div>
      <q-btn class="q-mt-md" color="primary" @click="savechanges()" label="Save" />
      <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
    </q-modal>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      circuit: '',
      headers: [],
      rows: [],
      paginationControl: { rowsPerPage: 0 },
      modalopen: false,
      labelOptions: [],
      preacherOptions: [],
      circuitOptions: [],
      planyear: parseInt(date.formatDate(Date.now(), 'YYYY')),
      planmonth: parseInt(date.formatDate(Date.now(), 'M')),
      perm: '',
      form: {
        plan: {
          person: {
            name: '',
            id: ''
          },
          service_id: '',
          society_id: '',
          tag: '',
          id: 0
        },
        rowndx: '',
        rowfld: '',
        servicedate: ''
      }
    }
  },
  computed: {
    monthname () {
      var mths = []
      mths[1] = 'January'
      mths[2] = 'February'
      mths[3] = 'March'
      mths[4] = 'April'
      mths[5] = 'May'
      mths[6] = 'June'
      mths[7] = 'July'
      mths[8] = 'August'
      mths[9] = 'September'
      mths[10] = 'October'
      mths[11] = 'November'
      mths[12] = 'December'
      return mths[this.planmonth]
    }
  },
  methods: {
    backmonth () {
      if (this.planmonth !== 1) {
        this.planmonth = this.planmonth - 1
      } else {
        this.planmonth = 12
        this.planyear = this.planyear - 1
      }
      this.showplan(this.planyear, this.planmonth)
    },
    forwardmonth () {
      if (this.planmonth !== 12) {
        this.planmonth = this.planmonth + 1
      } else {
        this.planmonth = 1
        this.planyear = this.planyear + 1
      }
      this.showplan(this.planyear, this.planmonth)
    },
    fixup (obj) {
      var label = ''
      if (!obj) {
        label = '<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>'
      } else {
        if (obj.tag) {
          if (obj.person.name) {
            label = '<span><small><b>' + obj.tag + '</b><br>' + obj.person.name + '</small></span>'
          } else {
            label = '<span><small><b>' + obj.tag + '</b><br></small></span>'
          }
        } else {
          label = '<span><small>' + obj.person.name + '</small></span>'
        }
      }
      return label
    },
    editplan (item, row, label, fld) {
      if (this.perm === 'view') {
        this.$q.notify('Sorry! You are not permitted to edit this plan')
      } else {
        this.form.servicedate = label
        this.form.societyname = JSON.parse(row.society).society + ' ' + JSON.parse(row.society).servicetime
        if (item) {
          this.form.plan = item
        } else {
          this.form.plan.person.name = ''
          this.form.plan.person.id = ''
          this.form.plan.tag = ''
          this.form.plan.id = 0
        }
        this.form.plan.service_id = JSON.parse(row.society).service_id
        this.form.plan.society_id = JSON.parse(row.society).society_id
        this.modalopen = true
        this.form.rowndx = row.__index
        this.form.rowfld = fld
      }
    },
    savechanges () {
      for (var lll in this.preacherOptions) {
        if (this.preacherOptions[lll].value === this.form.plan.person.id) {
          if (this.rows[this.form.rowndx][this.form.rowfld]) {
            this.rows[this.form.rowndx][this.form.rowfld].tag = this.form.plan.tag
            this.rows[this.form.rowndx][this.form.rowfld].person.name = this.preacherOptions[lll].abbr
          } else {
            this.form.plan.person.name = this.preacherOptions[lll].abbr
            this.rows[this.form.rowndx][this.form.rowfld] = this.form.plan
            this.rows[this.form.rowndx][this.form.rowfld].tag = this.form.plan.tag
          }
        }
      }
      this.$axios.post(this.$store.state.hostname + '/circuits/' + this.circuit + '/updateplan',
        {
          society_id: this.form.plan.society_id,
          service_id: this.form.plan.service_id,
          circuit_id: this.circuit,
          planyear: this.planyear,
          planmonth: this.planmonth,
          planday: parseInt(this.form.servicedate.split(' ')[0]),
          person_id: this.form.plan.person.id,
          servicetype: this.form.plan.tag,
          trialservice: null,
          id: this.form.plan.id
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(function (error) {
          this.error = error
        })
      this.modalopen = false
    },
    showplan (yy, mm) {
      this.perm = this.$store.state.user.circuits[this.circuit]
      if (this.$store.state.user.societies) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.get(this.$store.state.hostname + '/circuits/' + this.circuit + '/mplans/monthlyplan/' + yy + '/' + mm)
          .then(response => {
            this.rows = []
            for (var skey in response.data.plans) {
              var newitem = {}
              newitem.society = skey
              newitem.align = 'left'
              for (var pkey in response.data.plans[skey]) {
                var vname = '' + pkey
                newitem[vname] = {
                  person: response.data.plans[skey][pkey].person,
                  tag: response.data.plans[skey][pkey].tag,
                  id: response.data.plans[skey][pkey].id
                }
              }
              this.rows.push(newitem)
            }
            this.headers = [
              { label: 'Society', align: 'left', field: 'society' }
            ]
            for (var hkey in response.data.headers) {
              var newh = {
                label: response.data.headers[hkey],
                field: hkey,
                align: 'center'
              }
              this.headers.push(newh)
            }
            this.preacherOptions = []
            for (var ikey in response.data.preachers) {
              var newp = {
                label: response.data.preachers[ikey].surname + ', ' + response.data.preachers[ikey].title + ' ' + (response.data.preachers[ikey].firstname).substring(0, 1),
                abbr: (response.data.preachers[ikey].firstname).substring(0, 1) + ' ' + response.data.preachers[ikey].surname,
                value: response.data.preachers[ikey].person.id
              }
              this.preacherOptions.push(newp)
            }
            this.labelOptions = [
              { label: '', value: '' }
            ]
            for (var lkey in response.data.labels) {
              var newl = {
                label: response.data.labels[lkey].description,
                value: response.data.labels[lkey].label
              }
              this.labelOptions.push(newl)
            }
            this.$q.loading.hide()
            if (this.rows.length === 0) {
              this.$q.notify('Add services or societies to edit the preaching plan')
            }
            if (response.data.preachers.length === 0) {
              this.$q.notify('Add preachers to edit the preaching plan')
            }
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    }
  },
  mounted () {
    for (var ck in this.$store.state.user.circuits.full) {
      var newc = {
        label: this.$store.state.user.circuits.full[ck].circuit,
        value: this.$store.state.user.circuits.full[ck].id
      }
      this.circuitOptions.push(newc)
    }
    this.circuit = this.$store.state.user.circuits.keys[0]
    this.$q.loading.show()
    this.showplan(this.planyear, this.planmonth)
  }

}
</script>

<style>
a {
  text-decoration: none;
}
.q-item {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
