<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a roster <small>{{society}}</small>
      <q-btn v-if="this.$route.params.action === 'edit'" class="q-ml-md" @click="showRoster($route.params.id)">View roster</q-btn>
    </div>
    <societyselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
    <div class="q-mx-md">
      <q-input class="q-my-sm" label="Title" outlined hide-bottom-space error-message="The roster title field is required" v-model="form.title" :rules="[ val => val.length >= 1 ]"/>
    </div>
    <div class="q-mx-md">
      <q-input class="q-my-sm" type="textarea" label="Message" outlined hide-bottom-space error-message="The message field is required" v-model="form.message" :rules="[ val => val.length >= 1 ]"/>
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Day of week" v-model="form.dayofweek" :options="[{ label: 'Monday', value: 'Monday' }, { label: 'Tuesday', value: 'Tuesday' }, { label: 'Wednesday', value: 'Wednesday' }, { label: 'Thursday', value: 'Thursday' }, { label: 'Friday', value: 'Friday' }, { label: 'Saturday', value: 'Saturday' }, { label: 'Sunday', value: 'Sunday' }]"/>
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Reminder day" v-model="form.reminderday" :options="[{ label: 'Monday', value: 'Monday' }, { label: 'Tuesday', value: 'Tuesday' }, { label: 'Wednesday', value: 'Wednesday' }, { label: 'Thursday', value: 'Thursday' }, { label: 'Friday', value: 'Friday' }, { label: 'Saturday', value: 'Saturday' }, { label: 'Sunday', value: 'Sunday' }]"/>
    </div>
    <div v-if="this.$route.params.action === 'edit'">
      <p class="caption text-center">Roster Groups <q-btn class="q-ml-md" @click="modalopen = true">Add</q-btn></p>
      <q-item v-for="(rostergroup, index) in form.rostergroups" :key="rostergroup.id" :class="{striped: index % 2 === 1}">
        <q-item-section>
          {{rostergroup.group.groupname}} ({{rostergroup.maxpeople}})&nbsp;<template v-if="rostergroup.extrainfo === 'yes'">*</template>
        </q-item-section>
        <q-item-section align="right" class="cursor-pointer" @click.native="removeRostergroup(rostergroup.id)"><q-icon name="fa fa-times"/></q-item-section>
      </q-item>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
    <q-dialog minimized v-model="modalopen" content-css="padding: 50px">
      <q-card class="q-pa-md">
        <p class="caption text-center">Add a roster group</p>
        <q-input outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search by group name">
          <template v-slot:append>
            <q-icon name="fa fa-search" />
          </template>
        </q-input>
        <div v-if="search.length > 2">
          <q-select label="Group" v-model="form.group_id" :options="groupOptions"/>
          <q-input label="Maximum people" type="number" v-model="form.maxpeople"/>
          <q-toggle class="q-mt-md" v-model="form.extrainfo" true-value="yes" false-value="no" label="Extra info required?"/>
        </div>
        <div class="text-center">
          <q-btn class="q-mt-md" color="primary" @click="addGroup()" label="Save" />
          <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
        </div>
      </q-card>
    </q-dialog>
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
        message: '',
        dayofweek: 'Sunday',
        reminderday: 'Thursday',
        rostergroups: [],
        maxpeople: 1,
        group_id: '',
        extrainfo: ''
      }
    }
  },
  validations: {
    form: {
      title: { required },
      message: { required }
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
          this.form.message = response.data.message
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
      this.$router.push({ name: 'roster', params: { id: id, year: yr, month: mth } })
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
              reminderday: this.form.reminderday,
              message: this.form.message,
              society_id: this.$store.state.select
            })
            .then(response => {
              this.$router.push({ name: 'rosterform', params: { action: 'edit', id: response.data.id } })
            })
            .catch(function (error) {
              this.error = error
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/rosters/' + this.$route.params.id,
            {
              name: this.form.title,
              dayofweek: this.form.dayofweek,
              reminderday: this.form.reminderday,
              message: this.form.message,
              society_id: this.$store.state.select
            })
            .then(response => {
              this.$q.notify('Roster has been updated')
              this.$router.push({ name: 'rosters' })
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
          group_id: this.form.group_id.value,
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
  .q-item.striped {
    background-color:#E6f2d9;
  }
  a {
    text-decoration: none;
    color:white;
  }
</style>
