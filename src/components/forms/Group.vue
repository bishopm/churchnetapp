<template>
  <div class="q-ma-md">
    <div class="q-mx-md text-center caption">
      {{$route.params.action.charAt(0).toUpperCase() + $route.params.action.slice(1)}} group
    </div>
    <societyselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
    <q-input class="q-my-sm" label="Group name" outlined hide-bottom-space error-message="The group name field is required" v-model="form.groupname" :rules="[ val => val.length >= 1 ]"/>
    <q-input outlined label="Description" type="textarea" rows="3" v-model="form.description" />
    <q-select class="q-my-sm" outlined label="Group type" v-model="form.grouptype" :options="[{ label: 'Administration', value: 'administration' }, { label: 'Event', value: 'event' }, { label: 'Fellowship', value: 'fellowship' }, { label: 'Service', value: 'service' }]" map-options emit-value/>
    <q-select class="q-my-sm" outlined label="Leader" v-model="form.leader" :options="leaderOptions" map-options emit-value/>
    <q-datetime v-if="form.grouptype === 'event'" label="Event date and time" clearable format="YYYY-MM-DD HH:mm" format24h format-model="string" v-model="form.eventdatetime" type="datetime" />
    <q-radio v-model="form.signup" :val="1" label="Allow sign-up from Journey" />
    <q-radio v-model="form.signup" :val="0" label="Private group" />
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.back()" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" @click="deletegroup" color="black">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
export default {
  data () {
    return {
      form: {
        groupname: '',
        eventdatetime: '',
        description: '',
        grouptype: '',
        blocked: '',
        society_id: 0,
        leader: '',
        signup: 0
      },
      leaderOptions: [],
      admin: false
    }
  },
  components: {
    'societyselect': societyselect
  },
  validations: {
    form: {
      groupname: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        if (this.$route.params.action === 'edit') {
          this.$axios.post(process.env.API + '/groups/' + this.$route.params.id,
            {
              groupname: this.form.groupname,
              eventdatetime: this.form.eventdatetime,
              description: this.form.description,
              grouptype: this.form.grouptype,
              society_id: this.form.society_id,
              leader: this.form.leader,
              signup: this.form.signup
            })
            .then(response => {
              this.$q.notify('Group updated')
              this.$router.push({ name: 'group', params: { id: this.$route.params.id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.post(process.env.API + '/groups',
            {
              groupname: this.form.groupname,
              description: this.form.description,
              eventdatetime: this.form.eventdatetime,
              grouptype: this.form.grouptype,
              society_id: this.$store.state.select
            })
            .then(response => {
              this.$q.notify('Group added')
              this.$router.push({ name: 'group', params: { id: response.data } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    },
    deletegroup () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.delete(process.env.API + '/groups/' + this.$route.params.id)
        .then(response => {
          this.$q.notify('Group deleted')
          this.$router.push({ name: 'groups' })
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/groups/' + this.$route.params.id)
        .then((response) => {
          this.form.groupname = response.data.group.groupname
          this.form.description = response.data.group.description
          this.form.grouptype = response.data.group.grouptype
          this.form.eventdatetime = response.data.group.datestr
          this.form.society_id = response.data.group.society_id
          this.form.leader = response.data.group.leader
          if (response.data.group.signup === 1) {
            this.form.signup = 1
          } else {
            this.form.signup = 0
          }
          if (this.$store.state.user.societies[this.form.society_id] === 'admin') {
            this.admin = true
          }
          this.leaderOptions = []
          for (var mndx in response.data.members) {
            this.leaderOptions.push(
              {
                value: response.data.members[mndx].id,
                label: response.data.members[mndx].firstname + ' ' + response.data.members[mndx].surname
              }
            )
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.form.grouptype = 'administration'
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
