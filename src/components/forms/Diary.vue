<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a diary entry
      <small v-if="entity.circuit">{{entity.circuit}}</small>
      <small v-if="entity.society">{{entity.society}}</small>
      <small v-if="entity.district">{{entity.district}}</small>
    </div>
    <div class="q-mx-md">
      <q-field :error="$v.form.description.$error" error-label="Enter a description of the meeting">
        <q-input float-label="Description" v-model="form.description" @blur="$v.form.description.$touch()" :error="$v.form.description.$error" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-select float-label="Venue" v-model="form.society_id" :options="societyOptions"></q-select>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.meetingdatetime.$error" error-label="The date field is required">
        <q-datetime float-label="Date" clearable format="YYYY-MM-DD HH:mm" format24h format-model="string" v-model="form.meetingdatetime" type="datetime" @blur="$v.form.meetingdatetime.$touch()" :error="$v.form.meetingdatetime.$error" />
      </q-field>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" @click="deleteme" color="tertiary">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      scope: this.$route.params.scope,
      entity: {},
      societyOptions: [],
      id: '',
      form: {
        description: '',
        society_id: '',
        meetingdatetime: ''
      }
    }
  },
  validations: {
    form: {
      description: { required },
      meetingdatetime: { required }
    }
  },
  mounted () {
    this.entity = JSON.parse(this.$route.params.entity)
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/societies/search',
      {
        search: '',
        circuits: this.circuits
      })
      .then((response) => {
        for (var skey in response.data) {
          var newitem = {
            label: response.data[skey].society,
            value: response.data[skey].id
          }
          this.societyOptions.push(newitem)
        }
        if (this.$route.params.action === 'edit') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.get(process.env.API + '/meetings/' + this.$route.params.id)
            .then((response) => {
              this.form.description = response.data.description
              this.form.society_id = response.data.society_id
              this.form.meetingdatetime = response.data.datestr
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    deleteme () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
      this.$axios.delete(process.env.API + '/meetings/' + this.$route.params.id)
        .then(response => {
          this.$router.go(-1)
        })
        .catch(function (error) {
          this.error = error
        })
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/meetings',
            {
              society_id: this.form.society_id,
              circuit_id: this.circuit,
              description: this.form.description,
              meetingdatetime: this.form.meetingdatetime
            })
            .then(response => {
              console.log(response.data)
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/meetings/' + this.$route.params.id + '/update',
            {
              society_id: this.form.society_id,
              circuit_id: this.circuit,
              description: this.form.description,
              meetingdatetime: this.form.meetingdatetime
            })
            .then(response => {
              console.log(response.data)
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        }
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
</style>
