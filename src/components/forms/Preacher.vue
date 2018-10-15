<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} PREACHER
    </div>
    <circuitselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['edit','admin']" showme="1"></circuitselect>
    <q-search v-if="$route.params.action === 'add'" ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by name" />
    <div class="q-ma-md" v-if="individualOptions.length">
      <q-select float-label="Individual" v-model="form.individual_id" :options="individualOptions"/>
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
      <q-btn class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { between } from 'vuelidate/lib/validators'
import circuitselect from './../Circuitselect'
export default {
  data () {
    return {
      search: '',
      showdropdown: false,
      individualOptions: [],
      roleOptions: [],
      form: {
        fullplan: '',
        individual_id: '',
        circuit_id: '',
        roles: []
      }
    }
  },
  validations: {
    form: {
      fullplan: { between: between(1900, 2050) }
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
              var newitem = {
                label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                value: response.data[ikey].id
              }
              this.individualOptions.push(newitem)
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
    }
  },
  mounted () {
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
</style>
