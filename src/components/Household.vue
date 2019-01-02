<template>
  <div>
    <div v-if="household.addressee" class="text-center layout-padding">
      <p class="caption q-ma-md">
        <b>{{household.addressee}}</b>&nbsp;<q-btn v-if="perm === 'editor' || perm === 'admin'" color="primary" round size="sm" @click.native="editHousehold">edit</q-btn><br>
        <small>Pastoral notes: {{household.pastorals.length}} <q-icon name="fas fa-search" class="cursor-pointer" @click.native="modalopen = true;newopen=false"></q-icon></small>
      </p>
      <p class="text-left q-mx-md">
        <q-icon name="fas fa-fw fa-map-marker-alt" color="secondary"></q-icon> {{household.addr1}} {{household.addr2}} {{household.addr3}}<br>
        <q-icon name="fas fa-fw fa-phone" color="secondary"></q-icon> {{household.homephone}}
      </p>
      <div id="map" class="q-mt-md"></div>
      <div v-if="household.individuals.length">
        <q-tabs color="secondary" no-pane-border align="justify">
          <q-tab v-for="(individual, ndx) in household.individuals" :default="!ndx" :key="individual.id" slot="title" :name="'tab' + individual.id" :label="individual.firstname"/>
          <q-tab-pane v-for="individual in household.individuals" :key="individual.id" :name="'tab' + individual.id">
            <q-icon v-if="individual.surname" name="fas fa-user" color="primary"></q-icon> {{individual.title}} {{individual.firstname}} {{individual.surname}} <q-btn v-if="perm === 'editor' || perm === 'admin'" color="primary" round size="sm" @click.native="editIndividual(individual)">edit</q-btn><br>
            <q-icon v-if="individual.cellphone" name="fas fa-phone" color="primary"></q-icon> {{individual.cellphone}}<br>
            <q-icon v-if="individual.email" name="fas fa-envelope" color="primary"></q-icon> {{individual.email}}<br>
            <q-icon v-if="individual.memberstatus" name="fas fa-user-check" color="memberstatus"></q-icon> {{individual.memberstatus}}<br>
            <div v-if="individual.tags">
              <q-chip class="q-ma-xs" small color="secondary" v-for="tag in individual.tags" :key="tag.id">{{tag.name}}</q-chip>
            </div>
            <p class="caption q-mt-md">Groups</p>
            <div class="text-justify">
              <q-chip class="q-ma-xs" small color="primary" v-for="group in individual.groups" :key="group.id"><router-link :to="'/groups/' + group.id">{{group.groupname}}</router-link></q-chip>
            </div>
          </q-tab-pane>
          <q-tab key="0" slot="title" name="tabadd" icon="fas fa-plus-circle"/>
          <q-tab-pane name="tabadd">
            <q-btn @click.native="addIndividual()">Add a new member to this household</q-btn>
          </q-tab-pane>
        </q-tabs>
      </div>
      <div v-else class="q-mt-md">
        <p>No household members have been added yet</p>
        <q-btn class="q-mt-md" color="secondary" @click="addIndividual()">Add an individual</q-btn>
      </div>
      <q-modal minimized v-model="modalopen">
        <h4 class="text-center">Pastoral notes</h4>
        <div class="text-center q-mb-md">
          <q-btn v-if="!newopen" color="primary" icon="fas fa-plus" @click="addNote()">&nbsp;add</q-btn>
          <q-btn v-if="newopen" color="primary" icon="fas fa-plus" @click="saveNote">&nbsp;save</q-btn>
          <q-btn color="black" class="q-mx-sm" icon="fas fa-times" @click="modalopen=false">&nbsp;close</q-btn>
          <q-btn v-if="newopen" color="red" icon="fas fa-trash" @click="deleteNote()"></q-btn>
        </div>
        <div v-if="newopen" class="q-mx-md">
          <q-field :error="$v.form.pastoraldate.$error" error-label="The date field is required">
            <q-datetime float-label="Date" format="YYYY-MM-DD" format-model="string" v-model="form.pastoraldate" type="date" @blur="$v.form.pastoraldate.$touch()" :error="$v.form.pastoraldate.$error" />
          </q-field>
          <q-field :error="$v.form.details.$error" error-label="The details field is required">
            <q-input float-label="Details" v-model="form.details" @blur="$v.form.details.$touch()" :error="$v.form.details.$error" />
          </q-field>
          <q-field>
            <q-select float-label="Pastor" v-model="form.individual_id" :options="groupOptions"/>
          </q-field>
        </div>
        <q-list class="no-border">
          <q-item v-if="household.pastorals" v-for="pastoral in household.pastorals" :key="pastoral.id">
            <q-item-side>
              <small>
                <q-icon class="q-mr-xs cursor-pointer" color="black" name="fas fa-edit" @click.native="editNote(pastoral)"></q-icon>
                {{pastoral.individual.firstname}}<br>
                {{pastoral.pastoraldate}}
              </small>
            </q-item-side>
            <q-item-main><small>{{pastoral.details}}</small></q-item-main>
          </q-item>
          <p v-if="!household.pastorals.length"><small>No pastoral notes have been added to this household</small></p>
        </q-list>
      </q-modal>
    </div>
    <p class="q-ma-lg text-center caption">{{blocked}}</p>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      modalopen: false,
      newopen: false,
      groupOptions: [],
      form: {
        household_id: '',
        id: '',
        pastoraldate: new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' 00:00:00',
        details: '',
        individual_id: ''
      },
      household: {},
      map: null,
      marker: null,
      perm: '',
      blocked: ''
    }
  },
  validations: {
    form: {
      details: { required },
      pastoraldate: { required }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/households/' + this.$route.params.id)
      .then((response) => {
        if (response.data === 'Unauthorised') {
          this.blocked = 'Sorry - you are not authorised to view this household'
        } else {
          this.household = response.data
          this.form.household_id = this.household.id
          this.perm = this.$store.state.user.societies[this.household.society_id]
          if (this.$store.state.user.level < 5) {
            this.perm = 'edit'
          }
          this.$axios.get(process.env.API + '/groups/' + this.household.society.pastoral_group)
            .then((response) => {
              this.groupOptions = []
              for (var gkey in response.data.individuals) {
                var newitem = {
                  label: response.data.individuals[gkey].firstname + ' ' + response.data.individuals[gkey].surname,
                  value: response.data.individuals[gkey].id
                }
                this.groupOptions.push(newitem)
              }
            })
          this.initMap()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    editHousehold () {
      this.$router.push({name: 'householdform', params: { id: this.$route.params.id, action: 'edit' }})
    },
    editIndividual (individual) {
      individual.alltags = this.household.alltags
      this.$router.push({name: 'individualform', params: { individual: individual, action: 'edit' }})
    },
    addIndividual () {
      this.$router.push({name: 'individualform', params: { individual: {household_id: this.household.id, surname: this.household.sortsurname, sex: 'female', alltags: this.household.alltags}, action: 'add' }})
    },
    addNote () {
      this.form.id = ''
      this.form.details = ''
      this.form.pastoraldate = new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' 00:00:00'
      this.form.individual_id = ''
      this.newopen = true
    },
    deleteNote () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/pastorals/' + this.form.id)
        .then(response => {
          for (var pndx in this.household.pastorals) {
            if (this.household.pastorals[pndx].id === this.form.id) {
              this.household.pastorals.splice(pndx, 1)
            }
          }
          this.$q.notify(response.data)
          this.modalopen = false
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    saveNote () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/pastorals',
          {
            pastoral: this.form
          })
          .then(response => {
            if (response.data.message === 'Pastoral note has been created') {
              this.household.pastorals.unshift(response.data.pastoral)
            }
            this.$q.notify(response.data.message)
            this.modalopen = false
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    },
    editNote (note) {
      this.form = note
      this.newopen = true
    },
    async initMap () {
      await this.$google()
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(this.household.latitude), lng: parseFloat(this.household.longitude)},
        zoom: 15
      })
      this.marker = new window.google.maps.Marker({position: {lat: parseFloat(this.household.latitude), lng: parseFloat(this.household.longitude)}, map: this.map})
    }
  }
}
</script>

<style>
  .q-if-standard.q-if-has-label {
    padding-top: 15px;
  }
  a {
    text-decoration: none;
    color:white;
  }
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
  h4 {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .q-chip .q-icon {
    font-size: 16px;
  }
</style>
