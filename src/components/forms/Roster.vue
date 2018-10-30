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
    <h4 class="text-center">Roster Groups</h4>
    <q-search ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by group name to add roster groups" />
    <div class="q-ma-md" v-if="search.length > 2">
      <q-select @input="addGroup()" float-label="Group" v-model="group_id" :options="groupOptions"/>
    </div>
    <q-item v-for="rostergroup in form.rostergroups" :key="rostergroup.id">
      <q-item-main>{{rostergroup.group.groupname}}</q-item-main>
      <q-item-side color="red" icon="delete" class="cursor-pointer" @click.native="removeRostergroup(rostergroup.id)"></q-item-side>
    </q-item>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
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
      group_id: '',
      groupOptions: [],
      society: '',
      societies: [],
      search: '',
      form: {
        title: '',
        dayofweek: 'Sunday',
        rostergroups: []
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
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        }
      }
    },
    removeRostergroup (id) {
      console.log(id)
    },
    addGroup () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/rostergroups',
        {
          id: this.group_id
        })
        .then(response => {
          this.group = response.data
          this.search = ''
          this.$q.loading.hide()
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
