<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Circuit leaders</p>
      <q-item class="cursor-pointer" v-if="leaders" v-for="leader in leaders" :key="leader.id" @click.native="editLeader(leader)">
        <q-item-main><b>{{leader.surname}}</b>, {{leader.title}} {{leader.firstname}}</q-item-main>
        <q-item-side>
          <span v-for="tag in leader.tags" :key="tag.id">{{tag.name}} </span>
        </q-item-side>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addLeader" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
    <q-modal minimized v-model="modalopen" content-css="padding: 35px">
      <h4 class="text-center"><b>{{form.action}} circuit leader</b></h4>
      <p v-if="form.action === 'Edit'" class="caption text-center">{{leadername}}</p>
      <div class="bg-white">
        <q-select class="q-mb-md" multiple v-model="form.tags" float-label="Role" :options="tagOptions" />
      </div>
      <div v-if="form.action === 'Add' && !addnew" class="card bg-lightgrey">
        <q-search ref="search" @input="searchdb" v-model="search" placeholder="search by name" />
        <div v-if="individualOptions.length">
          <q-select float-label="Choose an existing person" v-model="form.individual_id" :options="individualOptions"/>
        </div>
        <div class="q-my-md text-center" v-if="search.length > 2">
          <q-btn color="secondary" @click="addnew=true" label="Or add a new person"></q-btn>
        </div>
      </div>
      <div v-if="addnew">
        <q-field class="bg-white" :error="$v.person.firstname.$error" error-label="This field is required">
          <q-input float-label="First name" v-model="person.firstname" @blur="$v.person.firstname.$touch()" :error="$v.person.firstname.$error"/>
        </q-field>
        <q-field class="bg-white" :error="$v.person.surname.$error" error-label="This field is required">
          <q-input float-label="Surname" v-model="person.surname" @blur="$v.person.surname.$touch()" :error="$v.person.surname.$error"/>
        </q-field>
        <q-field class="bg-white" :error="$v.person.cellphone.$error" error-label="The cellphone number must be numeric">
          <q-input float-label="Cellphone" v-model="person.cellphone" @blur="$v.person.cellphone.$touch()" :error="$v.person.cellphone.$error"/>
        </q-field>
        <div class="bg-white">
          <q-select float-label="Sex" v-model="person.sex" :options="[{ label: 'female', value: 'female' }, { label: 'male', value: 'male' }]"/>
        </div>
        <div class="bg-white">
          <q-select class="bg-white" float-label="Title" v-model="person.title" :options="[{ label: 'Dr', value: 'Dr' }, { label: 'Mr', value: 'Mr' }, { label: 'Mrs', value: 'Mrs' }, { label: 'Ms', value: 'Ms' }, { label: 'Prof', value: 'Prof' }, { label: 'Rev', value: 'Rev' }]"/>
        </div>
        <q-field class="bg-white" :error="$v.person.society_id.$error" error-label="This field is required">
          <q-select float-label="Society" v-model="person.society_id" :options="societyOptions" @blur="$v.person.society_id.$touch()" :error="$v.person.society_id.$error"/>
        </q-field>
      </div>
      <div class="text-center">
        <q-btn class="q-ml-md" color="primary" @click="saveChanges" label="OK" />
        <q-btn class="q-ml-md" color="black" @click="modalopen = false" label="Cancel" />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      addnew: false,
      circuits: [],
      leaders: [],
      search: '',
      tagOptions: [],
      individualOptions: [],
      societyOptions: [],
      leadername: '',
      form: {
        individual_id: '',
        action: '',
        tags: []
      },
      person: {
        firstname: '',
        surname: '',
        title: 'Ms',
        society_id: '',
        cellphone: '',
        sex: 'female'
      },
      modalopen: false
    }
  },
  validations: {
    form: {
      individual_id: { required },
      tags: { required }
    },
    person: {
      firstname: { required },
      surname: { required },
      cellphone: { numeric },
      society_id: { required }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/leaders/' + this.$route.params.id)
      .then(response => {
        this.leaders = response.data.individuals
        for (var tkey in response.data.tags) {
          var newitem = {
            label: response.data.tags[tkey].name,
            value: response.data.tags[tkey].tag_id
          }
          this.tagOptions.push(newitem)
        }
        this.circuits.push(this.$route.params.id)
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
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    addLeader () {
      this.form.individual_id = ''
      this.form.tags = []
      this.leadername = ''
      this.form.action = 'Add'
      this.addnew = false
      this.search = ''
      this.modalopen = true
    },
    editLeader (leader) {
      this.addnew = false
      this.form.individual_id = leader.id
      this.leadername = leader.title + ' ' + leader.firstname + ' ' + leader.surname
      this.form.tags = []
      for (var tag in leader.tags) {
        this.form.tags.push(leader.tags[tag].tag_id)
      }
      this.form.action = 'Edit'
      this.modalopen = true
    },
    saveChanges () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.form.action === 'Add') {
          this.$v.person.$touch()
          if (this.$v.person.$error) {
            this.$q.notify('Please check for errors!')
          } else {
            console.log('Add new indiv with appropriate tag')
            this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            this.$axios.post(process.env.API + '/leaders',
              {
                leader: this.form,
                individual: this.person,
                addnew: this.addnew
              })
              .then(response => {
                console.log(response.data)
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        } else {
          console.log('Change existing indiv and sync tags')
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/leaders',
            {
              leader: this.form
            })
            .then(response => {
              console.log(response.data)
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/searchnp',
          {
            search: this.search,
            circuit: this.$route.params.id
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
    }
  }

}
</script>

<style>
.bg-lightgrey {
  background-color: #eee;
  padding-top: 0px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
}
.bg-white {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}

h4 {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
