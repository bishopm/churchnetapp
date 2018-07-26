<template>
  <div class="layout-padding">
    <div class="q-mx-md text-center caption">
      Edit household
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.addressee.$error" error-label="The addressee field is required">
        <q-input float-label="Addressee" v-model="form.addressee" @blur="$v.form.addressee.$touch()" :error="$v.form.addressee.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-input float-label="Residential Address" v-model="form.addr1"/>
      <q-input v-model="form.addr2"/>
      <q-input v-model="form.addr3"/>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.homephone.$error" error-label="Phone numbers must be numeric">
        <q-input float-label="Home phone" v-model="form.homephone" @blur="$v.form.homephone.$touch()" :error="$v.form.homephone.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-btn color="primary" @click="submit">Submit</q-btn>
      <q-btn class="q-ml-md" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        addressee: '',
        addr1: '',
        addr2: '',
        addr3: '',
        homephone: ''
      }
    }
  },
  validations: {
    form: {
      addressee: { required },
      addr1: { required },
      addr2: { required },
      addr3: { required },
      homephone: { numeric }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.form.$error) {
        this.$q.notify('Please review fields again.')
      }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
      .then((response) => {
        this.form = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
