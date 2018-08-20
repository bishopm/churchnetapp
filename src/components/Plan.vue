<template>
  <div class="layout-padding">
    <q-table v-if="headers" dense :title="title" :data="rows" :columns="headers" :pagination.sync="paginationControl" hide-bottom>
      <q-td slot='body-cell' slot-scope='props' :props='props' @click.native="editplan(props.row[props.col.field], props.row, headers[1 + parseInt(props.col.field)].label)">
        <div v-if="props.col.field === 'society'">
          <b>{{JSON.parse(props.row[props.col.field]).society}}</b>&nbsp;<small>{{JSON.parse(props.row[props.col.field]).servicetime}}</small>
        </div>
        <div v-else v-html="fixup(props.row[props.col.field])"></div>
      </q-td>
    </q-table>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <q-input float-label="Service date" v-model="form.servicedate"/>
      <div class="q-my-md">
        <q-select float-label="Preacher" v-model="form.plan.person.id" :options="preacherOptions"/>
      </div>
      <q-btn class="q-mt-md" color="primary" @click="dochanges()" label="Close" />
    </q-modal>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  data () {
    return {
      circuit: 164,
      headers: [],
      rows: [],
      title: 'Preaching plan: ' + date.formatDate(Date.now(), 'MMMM YYYY'),
      paginationControl: { rowsPerPage: 0 },
      modalopen: false,
      preacherOptions: [],
      form: {
        plan: {
          person: {
            name: '',
            id: ''
          },
          service: '',
          society: ''
        },
        servicedate: ''
      }
    }
  },
  methods: {
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
    editplan (item, row, label) {
      this.form.servicedate = label
      if (item) {
        this.form.plan = item
      } else {
        this.form.plan.person.name = ''
        this.form.plan.person.id = ''
        this.form.plan.service = JSON.parse(row.society).service_id
        this.form.plan.society = JSON.parse(row.society).society_id
      }
      this.modalopen = true
    },
    dochanges () {
      
      this.modalopen = false
    },
    searchdb () {
      if (this.$store.state.societies) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.get(this.$store.state.hostname + '/circuits/' + this.circuit + '/mplans/monthlyplan/2018/8')
          .then(response => {
            for (var skey in response.data.plans) {
              var newitem = {}
              newitem.society = skey
              newitem.align = 'left'
              for (var pkey in response.data.plans[skey]) {
                var vname = '' + pkey
                newitem[vname] = {
                  person: response.data.plans[skey][pkey].person,
                  tag: response.data.plans[skey][pkey].tag
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
            for (var ikey in response.data.preachers) {
              var newp = {
                label: response.data.preachers[ikey].surname + ', ' + response.data.preachers[ikey].title + ' ' + (response.data.preachers[ikey].firstname).substring(0, 1),
                value: response.data.preachers[ikey].person.id
              }
              this.preacherOptions.push(newp)
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
a {
  text-decoration: none;
}
</style>
