<template>
  <div class="layout-padding">
    <p class="caption text-center" v-if="society">{{society.society}}</p>
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a service
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.servicetime.$error" error-label="The service time field is required">
        <q-datetime float-label="Service time" v-model="form.servicetime" type="time" @blur="$v.form.servicetime.$touch()" :error="$v.form.servicetime.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Language" v-model="form.language" :options="[{ label: 'Afrikaans', value: 'Afrikaans' }, { label: 'English', value: 'English' }, { label: 'isiZulu', value: 'isiZulu' }]" @blur="$v.form.language.$touch()" :error="$v.form.language.$error"/>
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
      society: JSON.parse(this.$route.params.society),
      id: '',
      form: {
        servicetime: '09:00',
        language: 'isiZulu'
      }
    }
  },
  validations: {
    form: {
      servicetime: { required },
      language: { required }
    }
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
