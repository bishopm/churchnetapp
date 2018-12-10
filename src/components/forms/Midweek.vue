<template>
  <div class="layout-padding">
    <p class="caption text-center" v-if="circuit">{{circuit.circuit}}</p>
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a midweek service
    </div>
    <div class="q-mx-md">
      <q-field :error="$v.form.description.$error" error-label="Enter a description of the service">
        <q-input float-label="Service" v-model="form.description" @blur="$v.form.description.$touch()" :error="$v.form.description.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.servicedate.$error" error-label="The date field is required">
        <q-datetime type="date" float-label="Service date" format="YYYY-MM-DD" format24h format-model="string" v-model="form.servicedate" @blur="$v.form.servicedate.$touch()" :error="$v.form.servicedate.$error" />
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
      circuit: this.$route.params.circuit,
      circuits: [],
      societyOptions: [],
      id: '',
      form: {
        description: '',
        servicedate: ''
      }
    }
  },
  validations: {
    form: {
      description: { required },
      servicedate: { required }
    }
  },
  mounted () {
    this.circuits.push(this.circuit)
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/weekdays/' + this.$route.params.id)
        .then((response) => {
          this.form.description = response.data.description
          this.form.servicedate = response.data.datestr
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    deleteme () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
      this.$axios.delete(process.env.API + '/weekdays/' + this.$route.params.id)
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
          this.$axios.post(process.env.API + '/weekdays',
            {
              circuit_id: this.circuit,
              description: this.form.description,
              servicedate: this.form.servicedate
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
          this.$axios.post(process.env.API + '/weekdays/' + this.$route.params.id + '/update',
            {
              society_id: this.form.society_id,
              circuit_id: this.circuit,
              description: this.form.description,
              servicedate: this.form.servicedate
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
