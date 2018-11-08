<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a roster <small>{{society}}</small>
      <q-btn v-if="this.$route.params.action === 'edit'" class="q-ml-md" @click="showRoster($route.params.id)">View roster</q-btn>
    </div>
    <societyselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['edit','admin']" showme="1"></societyselect>
    <div class="q-mx-md">
      <q-field :error="$v.form.title.$error" error-label="The roster title field is required">
        <q-input float-label="Roster title" v-model="form.title" @blur="$v.form.title.$touch()" :error="$v.form.title.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Day of week" v-model="form.dayofweek" :options="[{ label: 'Monday', value: 'Monday' }, { label: 'Tuesday', value: 'Tuesday' }, { label: 'Wednesday', value: 'Wednesday' }, { label: 'Thursday', value: 'Thursday' }, { label: 'Friday', value: 'Friday' }, { label: 'Saturday', value: 'Saturday' }, { label: 'Sunday', value: 'Sunday' }]"/>
    </div>
    <div v-if="this.$route.params.action === 'edit'">
      <p class="caption text-center">Roster Groups <q-btn class="q-ml-md" @click="modalopen = true">Add</q-btn></p>
      <q-item v-for="rostergroup in form.rostergroups" :key="rostergroup.id">
        <q-item-main>
          {{rostergroup.group.groupname}} ({{rostergroup.maxpeople}})
          <span v-if="rostergroup.extrainfo === 'yes'">*</span>
        </q-item-main>
        <q-item-side color="red" icon="delete" class="cursor-pointer" @click.native="removeRostergroup(rostergroup.id)"></q-item-side>
      </q-item>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <h4>Add a roster group</h4>
      <q-search ref="search" @input="searchdb" v-model="search" placeholder="search by group name" />
      <div v-if="search.length > 2">
        <q-select float-label="Group" v-model="form.group_id" :options="groupOptions"/>
        <q-input float-label="Maximum people" type="number" v-model="form.maxpeople"/>
        <q-toggle class="q-mt-md" v-model="form.extrainfo" true-value="yes" false-value="no" label="Extra info required?"/>
      </div>
      <div class="text-center">
        <q-btn class="q-mt-md" color="primary" @click="addGroup()" label="Save" />
        <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
import { format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      id: '',
      groupOptions: [],
      society: '',
      societies: [],
      search: '',
      modalopen: false,
      form: {
        title: '',
        dayofweek: 'Sunday',
        rostergroups: [],
        maxpeople: 1,
        group_id: '',
        extrainfo: ''
      }
    }
  },
  validations: {
    form: {
      title: { required }
    }
  },
  components: {
    'societyselect': societyselect
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rosters/' + this.$route.params.id)
        .then((response) => {
          this.form.title = response.data.name
          this.form.dayofweek = response.data.dayofweek
          this.society = response.data.society.society
          this.societies.push(response.data.society.id)
          this.form.rostergroups = response.data.rostergroups
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.societies.push(this.$store.state.select)
    }
  },
  methods: {
    showRoster (id) {
      var yr = new Date().getFullYear()
      var months = new Array(12)
      months[0] = 'January'
      months[1] = 'February'
      months[2] = 'March'
      months[3] = 'April'
      months[4] = 'May'
      months[5] = 'June'
      months[6] = 'July'
      months[7] = 'August'
      months[8] = 'September'
      months[9] = 'October'
      months[10] = 'November'
      months[11] = 'December'
      var mth = months[new Date().getMonth()]
      this.$router.push({name: 'roster', params: { id: id, year: yr, month: mth }})
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/rosters',
            {
              name: this.form.title,
              dayofweek: this.form.dayofweek,
              society_id: this.$store.state.select
            })
            .then(response => {
              this.$router.push({name: 'rosterform', params: { action: 'edit', id: response.data.id }})
            })
            .catch(function (error) {
              this.error = error
            })
        }
      }
    },
    removeRostergroup (id) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.delete(process.env.API + '/rostergroups/' + id)
        .then(response => {
          for (var gkey in this.form.rostergroups) {
            if (this.form.rostergroups[gkey].id === id) {
              this.form.rostergroups.splice(gkey, 1)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    addGroup () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/rostergroups',
        {
          roster_id: this.$route.params.id,
          group_id: this.form.group_id,
          maxpeople: this.form.maxpeople,
          extrainfo: this.form.extrainfo
        })
        .then(response => {
          this.modalopen = false
          this.form.rostergroups.push(response.data)
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/groups/search',
          {
            search: this.search,
            societies: this.societies
          })
          .then(response => {
            this.groupOptions = []
            for (var gkey in response.data) {
              var newitem = {
                label: response.data[gkey].groupname,
                value: response.data[gkey].id
              }
              this.groupOptions.push(newitem)
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      } else {
        this.individualOptions = []
        this.group.individual_id = ''
      }
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
</style>
