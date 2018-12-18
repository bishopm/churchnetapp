<template>
  <div class="layout-padding">
    <div class="q-mx-md text-center caption">
      {{$route.params.action.charAt(0).toUpperCase() + $route.params.action.slice(1)}} group
    </div>
    <societyselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
    <div class="q-ma-md">
      <q-field :error="$v.form.groupname.$error" error-label="The group name is required">
        <q-input float-label="Group name" v-model="form.groupname" @blur="$v.form.groupname.$touch()" :error="$v.form.groupname.$error" />
      </q-field>
      <q-field>
        <q-input float-label="Description" type="textarea" rows="3" v-model="form.description" />
      </q-field>
      <q-field>
        <q-select float-label="Group type" v-model="form.grouptype" :options="[{ label: 'Administration', value: 'administration' }, { label: 'Event', value: 'event' }, { label: 'Fellowship', value: 'fellowship' }, { label: 'Service', value: 'service' }]"/>
      </q-field>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.back()" color="secondary">Cancel</q-btn>
      <q-btn v-if="admin" class="q-ml-md" @click="deletegroup" color="black">Delete</q-btn>
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
        description: '',
        grouptype: '',
        blocked: '',
        society_id: 0
      },
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
              description: this.form.description,
              grouptype: this.form.grouptype,
              society_id: this.$store.state.select
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
          this.form = response.data
          if (this.$store.state.user.societies[this.form.society_id] === 'admin') {
            this.admin = true
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
