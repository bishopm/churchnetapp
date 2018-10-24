<template>
  <div class="layout-padding">
    <p class="caption text-center" v-if="circuit">{{circuit.circuit}}</p>
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a meeting
    </div>
    <div class="q-mx-md">
      <q-field :error="$v.form.description.$error" error-label="Enter a description of the meeting">
        <q-input float-label="Meeting" v-model="form.description" @blur="$v.form.description.$touch()" :error="$v.form.description.$error" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-select float-label="Venue" v-model="form.society_id" :options="societyOptions"></q-select>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.meetingdatetime.$error" error-label="The date field is required">
        <q-datetime float-label="Meeting date" v-model="form.meetingdatetime" type="datetime" @blur="$v.form.meetingdatetime.$touch()" :error="$v.form.meetingdatetime.$error" />
      </q-field>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { date, format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      circuit: this.$route.params.circuit,
      circuits: [],
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
    this.circuits.push(this.circuit)
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
          this.$axios.get(process.env.API + '/circuits/' + this.society.circuit_id + '/services/' + this.$route.params.service)
            .then((response) => {
              this.form.language = response.data.language
              this.form.servicetime = date.buildDate({ hours: response.data.servicetime.slice(0, 2), minutes: response.data.servicetime.slice(3) })
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
          this.$axios.post(process.env.API + '/circuits/' + this.society.circuit_id + '/services/' + this.$route.params.service,
            {
              society_id: this.society.id,
              servicetime: date.formatDate(this.form.servicetime, 'HH:mm'),
              language: this.form.language
            })
            .then(response => {
              console.log(response.data)
              this.$router.go(-1)
            })
            .catch(function (error) {
              console.log(error)
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
