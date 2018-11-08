<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} USER
    </div>
    <circuitselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['edit','admin']" showme="1"></circuitselect>
    <q-search ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by name for an existing circuit member" />
    <div class="q-ma-md" v-if="individualOptions.length">
      <q-select @input="populateIndiv()" float-label="Individual" v-model="form.indiv" :options="individualOptions"/>
    </div>
    <div class="q-ma-md" v-html="userdetails">
    </div>
    <div v-if="userdetails" class="q-ma-md text-center">
      <q-btn color="primary" @click="submitexist">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
    </div>
    <div v-if="!form.indiv" class="text-center">or add a new individual
      <div class="q-mx-md">
        <q-field :error="$v.form.surname.$error" error-label="The surname field is required">
          <q-input float-label="Surname" v-model="form.surname" @blur="$v.form.surname.$touch()" :error="$v.form.surname.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.form.firstname.$error" error-label="The firstname field is required">
          <q-input float-label="First name" v-model="form.firstname" @blur="$v.form.firstname.$touch()" :error="$v.form.firstname.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-select float-label="Sex" v-model="form.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]" />
      </div>
      <div class="q-mx-md">
        <q-select float-label="Title" v-model="form.title" :options="[{ label: 'Dr', value: 'Dr' }, { label: 'Mr', value: 'Mr' }, { label: 'Mrs', value: 'Mrs' }, { label: 'Ms', value: 'Ms' }, { label: 'Prof', value: 'Prof' }, { label: 'Rev', value: 'Rev' }]"/>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.form.cellphone.$error" error-label="Phone numbers must be numeric">
          <q-input float-label="Cellphone" v-model="form.cellphone" @blur="$v.form.cellphone.$touch()" :error="$v.form.cellphone.$error" />
        </q-field>
      </div>
      <div class="q-mx-md">
        <q-field :error="$v.form.email.$error" error-label="Email address is required">
          <q-input float-label="Email" v-model="form.email" @blur="$v.form.email.$touch()" :error="$v.form.email.$error" />
        </q-field>
      </div>
      <div class="q-mx-md text-center">
        <q-btn color="primary" @click="submitnew">OK</q-btn>
        <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { required, numeric, email } from 'vuelidate/lib/validators'
import circuitselect from './../Circuitselect'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        surname: '',
        firstname: '',
        title: '',
        sex: '',
        cellphone: '',
        indiv: ''
      },
      search: '',
      userdetails: '',
      individualOptions: []
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  validations: {
    form: {
      surname: { required },
      firstname: { required },
      email: { required, email },
      cellphone: { numeric }
    }
  },
  methods: {
    searchdb () {
      if (this.search.length < 2) {
        this.userdetails = ''
        this.individualOptions = []
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/search',
          {
            search: this.search,
            circuit: this.$store.state.select
          })
          .then(response => {
            this.individualOptions = []
            for (var ikey in response.data) {
              var newitem = {
                label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                value: {
                  id: response.data[ikey].id,
                  surname: response.data[ikey].surname,
                  firstname: response.data[ikey].firstname,
                  sex: response.data[ikey].sex,
                  title: response.data[ikey].title,
                  email: response.data[ikey].email,
                  cellphone: response.data[ikey].cellphone
                }
              }
              this.individualOptions.push(newitem)
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    },
    populateIndiv () {
      this.userdetails = '<b>Link user to: </b>' + this.form.indiv.title + ' ' + this.form.indiv.firstname + ' ' + this.form.indiv.surname + ' (Phone: ' + this.form.indiv.cellphone + ')'
    },
    submitexist () {
      this.submit()
    },
    submitnew () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.submit()
      }
    },
    submit () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/users',
        {
          user: this.form
        })
        .then(response => {
          this.$q.loading.hide()
          this.$q.notify('User added')
          this.$router.push({ name: 'user', params: { id: response.data.id } })
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
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
