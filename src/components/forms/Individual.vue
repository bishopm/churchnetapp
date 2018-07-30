<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md text-center caption">
      {{$route.params.action.toUpperCase()}} INDIVIDUAL
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.surname.$error" error-label="The surname field is required">
        <q-input float-label="Surname" v-model="form.surname" @blur="$v.form.surname.$touch()" :error="$v.form.surname.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.firstname.$error" error-label="The firstname field is required">
        <q-input float-label="First name" v-model="form.firstname" @blur="$v.form.firstname.$touch()" :error="$v.form.firstname.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Sex" v-model="form.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Title" v-model="form.title" :options="[{ label: 'Mr', value: 'Mr' }, { label: 'Mrs', value: 'Mrs' }]"/>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.birthdate.$error" error-label="Must be a valid date">
        <q-input float-label="Date of birth" v-model="form.birthdate" @blur="$v.form.birthdate.$touch()" :error="$v.form.birthdate.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.email.$error" error-label="Must be a valid email address">
        <q-input float-label="Email" v-model="form.email" @blur="$v.form.email.$touch()" :error="$v.form.email.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.cellphone.$error" error-label="Phone numbers must be numeric">
        <q-input float-label="Cellphone" v-model="form.cellphone" @blur="$v.form.cellphone.$touch()" :error="$v.form.cellphone.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-btn color="primary" @click="submit">Submit</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric, email } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        surname: '',
        firstname: '',
        birthdate: '',
        title: '',
        email: '',
        cellphone: ''
      }
    }
  },
  validations: {
    form: {
      surname: { required },
      firstname: { required },
      birthdate: { required },
      email: { email },
      cellphone: { numeric }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        // if action = edit / add
        this.$q.notify('Good to go!')
      }
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.form = this.$route.params.individual
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
