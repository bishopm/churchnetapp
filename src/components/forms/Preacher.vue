<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} PREACHER / MINISTER
    </div>
    <circuitselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['edit','admin']" showme="1"></circuitselect>
    <div class="card q-ma-xs bg-lightgrey">
      <q-search v-if="$route.params.action === 'add'" ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="find the preacher or minister's name" />
      <div class="q-ma-md" v-if="individualOptions.length">
        <q-select float-label="Choose an existing person" v-model="form.individual_id" :options="individualOptions"/>
      </div>
      <div class="text-center" v-if="search.length > 2">
        <q-btn color="black" @click="modalopen=true" label="Or add a new person"></q-btn>
      </div>
    </div>
    <div v-if="form.status !== 'minister'" class="q-ma-md">
      <q-field :error="$v.form.fullplan.$error" error-label="This field must be a valid year">
        <q-input float-label="Year on full plan (leave blank if not on full plan)" v-model="form.fullplan" @blur="$v.form.fullplan.$touch()" :error="$v.form.fullplan.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select @input="populateTags(form.status)" float-label="Status" v-model="form.status" :options="[{ label: 'Biblewoman', value: 'biblewoman' }, { label: 'Deacon', value: 'deacon' }, { label: 'Evangelist', value: 'evangelist' }, { label: 'Local preacher', value: 'preacher' }, { label: 'Minister', value: 'minister' }]"/>
    </div>
    <div class="q-ma-md">
      <q-select multiple chips float-label="Roles" v-model="form.roles" :options="roleOptions"/>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="black">Delete</q-btn>
    </div>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <div class="caption text-center">Add a new individual</div>
      <q-field v-if="modalopen" :error="$v.person.firstname.$error" error-label="This field is required">
        <q-input float-label="First name" v-model="person.firstname" @blur="$v.person.firstname.$touch()" :error="$v.person.firstname.$error"/>
      </q-field>
      <q-field v-if="modalopen" :error="$v.person.surname.$error" error-label="This field is required">
        <q-input float-label="Surname" v-model="person.surname" @blur="$v.person.surname.$touch()" :error="$v.person.surname.$error"/>
      </q-field>
      <q-field v-if="modalopen" :error="$v.person.cellphone.$error" error-label="The cellphone number must be numeric">
        <q-input float-label="Cellphone" v-model="person.cellphone" @blur="$v.person.cellphone.$touch()" :error="$v.person.cellphone.$error"/>
      </q-field>
      <q-select float-label="Sex" v-model="person.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
      <q-select float-label="Title" v-model="person.title" :options="[{ label: 'Dr', value: 'Dr' }, { label: 'Mr', value: 'Mr' }, { label: 'Mrs', value: 'Mrs' }, { label: 'Ms', value: 'Ms' }, { label: 'Prof', value: 'Prof' }, { label: 'Rev', value: 'Rev' }]"/>
      <q-field v-if="modalopen" :error="$v.person.society_id.$error" error-label="This field is required">
        <q-select float-label="Society" v-model="person.society_id" :options="societyOptions" @blur="$v.person.society_id.$touch()" :error="$v.person.society_id.$error"/>
      </q-field>
      <div class="text-center">
        <q-btn class="q-mt-md" color="primary" @click="addperson()" label="Save" />
        <q-btn class="q-mt-md q-ml-md" color="black" @click="modalopen = false" label="Cancel" />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { between, required, numeric } from 'vuelidate/lib/validators'
import circuitselect from './../Circuitselect'
export default {
  data () {
    return {
      search: '',
      circuits: [],
      showdropdown: false,
      individualOptions: [],
      societyOptions: [],
      roleOptions: [],
      modalopen: false,
      form: {
        fullplan: '',
        individual_id: '',
        circuit_id: '',
        roles: []
      },
      person: {
        firstname: '',
        surname: '',
        title: 'Ms',
        society_id: '',
        cellphone: '',
        sex: 'female'
      }
    }
  },
  validations: {
    form: {
      fullplan: { between: between(1900, 2050) },
      individual_id: { required },
      roles: { required }
    },
    person: {
      firstname: { required },
      surname: { required },
      cellphone: { numeric },
      society_id: { required }
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$q.loading.show()
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/circuits/' + this.$store.state.select + '/people',
            {
              circuit_id: this.$store.state.select,
              fullplan: this.form.fullplan,
              individual_id: this.form.individual_id,
              roles: this.form.roles,
              status: this.form.status
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Preacher added')
              this.$router.push({ name: 'preachers' })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/circuits/' + this.form.circuit_id + '/people/' + this.form.id,
            {
              circuit_id: this.form.circuit_id,
              fullplan: this.form.fullplan,
              individual_id: this.form.individual_id,
              roles: this.form.roles,
              status: this.form.status
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Preacher updated')
              this.$router.push({ name: 'preachers' })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    },
    populateTags (category) {
      this.roleOptions = []
      for (var rkey in this.form.alltags[category]) {
        var newitem = {
          label: this.form.alltags[category][rkey].name,
          value: this.form.alltags[category][rkey].id
        }
        this.roleOptions.push(newitem)
      }
      this.form.roles = []
      for (var tkey in this.form.tags) {
        this.form.roles.push(this.form.tags[tkey].tag_id)
      }
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/searchnp',
          {
            search: this.search,
            circuit: this.$store.state.select
          })
          .then(response => {
            this.individualOptions = []
            for (var ikey in response.data) {
              if (response.data[ikey.title]) {
                var newitem1 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem1)
              } else {
                var newitem2 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem2)
              }
            }
            if (this.individualOptions.length) {
              this.form.individual_id = this.individualOptions[0].value
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      } else {
        this.individualOptions = []
        this.form.individual_id = ''
      }
    },
    addperson () {
      this.$v.person.$touch()
      if (this.$v.person.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/combined',
          {
            firstname: this.person.firstname,
            surname: this.person.surname,
            phone: this.person.cellphone,
            society_id: this.person.society_id,
            sex: this.person.sex,
            title: this.person.title,
            adduser: 'no'
          })
          .then(response => {
            this.search = ''
            this.modalopen = false
            this.$q.notify('New individual has been added')
            var newp = {
              label: response.data.surname + ', ' + response.data.firstname + ' (' + response.data.society + ')',
              value: response.data.id
            }
            this.individualOptions.push(newp)
            this.form.individual_id = response.data.id
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  mounted () {
    this.circuits.push(this.$store.state.select)
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/societies/search',
      {
        search: '',
        circuits: this.circuits
      })
      .then(response => {
        for (var sndx in response.data) {
          var newitem = {
            label: response.data[sndx].society,
            value: response.data[sndx].id
          }
          this.societyOptions.push(newitem)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    if (this.$route.params.action === 'edit') {
      this.form = JSON.parse(this.$route.params.preacher)
      var newitem = {
        label: this.form.individual.surname + ', ' + this.form.individual.title + ' ' + this.form.individual.firstname + ' (' + this.form.individual.household.society.society + ')',
        value: this.form.individual.id
      }
      this.individualOptions.push(newitem)
      this.populateTags(this.form.status)
    } else {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/tags')
        .then((response) => {
          this.form.alltags = response.data
        })
        .catch(function (error) {
          console.log(error)
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
  .bg-lightgrey {
    background-color: #eee;
    padding-top:10px;
    padding-bottom:10px;
  }
</style>
