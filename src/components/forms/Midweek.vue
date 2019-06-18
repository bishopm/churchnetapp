<template>
  <div class="q-ma-md">
    <p class="caption text-center" v-if="circuit">{{circuit.circuit}}</p>
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a midweek service
    </div>
    <div class="q-ma-md">
      <q-input label="Service description" outlined hide-bottom-space error-message="The service description field is required" v-model="form.description" :rules="[ val => val.length >= 1 ]" />
    </div>
    <div class="q-ma-md">
      <q-input label="Service date" outlined v-model="form.servicedate" mask="####-##-##">
        <template v-slot:append>
          <q-icon name="fa fa-calendar" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date mask="YYYY-MM-DD" v-model="form.servicedate" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" @click="deleteme" color="black">Delete</q-btn>
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
