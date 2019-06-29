<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} USER
    </div>
    <circuitselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></circuitselect>
    <q-input class="q-mx-md" outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search name for an existing circuit member">
      <template v-slot:append>
        <q-icon name="fa fa-search" />
      </template>
    </q-input>
    <div class="q-ma-md" v-if="individualOptions.length">
      <q-select outlined @input="populateIndiv()" label="Individual" v-model="form.indiv" :options="individualOptions"/>
    </div>
    <div class="q-ma-md" v-html="userdetails">
    </div>
    <div v-if="userdetails" class="q-ma-md text-center">
      <q-btn color="primary" @click="submitexist">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
    </div>
    <div v-if="!form.indiv" class="text-center">or add a new individual
      <div class="q-mx-md">
        <q-input class="q-my-sm" label="Surname" outlined hide-bottom-space error-message="Surname field is required" v-model="form.surname" :rules="[ val => val.length >= 1 ]"/>
      </div>
      <div class="q-mx-md">
        <q-input class="q-my-sm" label="First name" outlined hide-bottom-space error-message="First name field is required" v-model="form.surname" :rules="[ val => val.length >= 1 ]"/>
      </div>
      <div class="q-mx-md q-my-sm">
        <q-select outlined label="Sex" v-model="form.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]" />
      </div>
      <div class="q-mx-md">
        <q-select outlined label="Title" v-model="form.title" :options="[{ label: 'Dr', value: 'Dr' }, { label: 'Mr', value: 'Mr' }, { label: 'Mrs', value: 'Mrs' }, { label: 'Ms', value: 'Ms' }, { label: 'Prof', value: 'Prof' }, { label: 'Rev', value: 'Rev' }]"/>
      </div>
      <div class="q-mx-md">
        <q-input class="q-my-sm" label="Cellphone" outlined v-model="form.cellphone"/>
      </div>
      <div class="q-mx-md">
        <q-input class="q-my-sm" label="Email" outlined hide-bottom-space error-message="Email field is required" v-model="form.email" :rules="[ val => val.length >= 1 ]"/>
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
      this.userdetails = '<b>Link user to: </b>' + this.form.indiv.value.title + ' ' + this.form.indiv.value.firstname + ' ' + this.form.indiv.value.surname
      if (this.form.indiv.value.cellphone) {
        this.userdetails = this.userdetails + ' (Phone: ' + this.form.indiv.value.cellphone + ')'
      }
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
