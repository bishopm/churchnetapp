<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a roster
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.title.$error" error-label="The roster title field is required">
        <q-input float-label="Roster title" v-model="form.title" @blur="$v.form.title.$touch()" :error="$v.form.title.$error" />
      </q-field>
    </div>
    <societyselect @altered="displayrosters" class="q-ma-md" :perms="['edit','admin']" showme="1"></societyselect>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
import { date, format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      id: '',
      form: {
        servicetime: '09:00',
        society_id: 'isiZulu'
      }
    }
  },
  validations: {
    form: {
      title: { required },
      society_id: { required }
    }
  },
  components: {
    'societyselect': societyselect
  },
  mounted () {
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
    } else {
      this.form.society = 667
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/circuits/' + this.society.circuit_id + '/services',
            {
              society_id: this.society.id,
              servicetime: date.formatDate(this.form.servicetime, 'HH:mm'),
              language: this.form.language
            })
            .then(response => {
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
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
</style>
