<template>
  <div>
    <leafletmap v-if="household.location" :latitude="household.location.latitude" :longitude="household.location.longitude" :popuplabel="household.addressee" editable="no"></leafletmap>
    <div v-if="household.addressee" class="text-center q-mx-ma">
      <p class="caption q-ma-md">
        <b>{{household.addressee}}</b>&nbsp;<q-btn v-if="perm === 'editor' || perm === 'admin'" color="primary" round size="sm" @click.native="editHousehold">edit</q-btn><br>
        <small>Pastoral notes: {{household.pastorals.length}} <q-icon name="fas fa-search" class="cursor-pointer" @click.native="modalopen = true;newopen=false"></q-icon></small>&nbsp;
        <small>Anniversaries: {{household.specialdays.length}} <q-icon name="fas fa-search" class="cursor-pointer" @click.native="amodalopen = true;anewopen=false"></q-icon></small>
      </p>
      <p class="text-left q-mx-md">
        <q-icon name="fas fa-fw fa-map-marker-alt" color="secondary"></q-icon> {{household.location.address}}<br>
        <q-icon name="fas fa-fw fa-phone" color="secondary"></q-icon> {{household.location.phone}}
      </p>
    </div>
    <div v-if="household.addressee" class="text-center layout-padding">
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
        <q-list v-if="household.pastorals" class="no-border">
          <q-item v-for="pastoral in household.pastorals" :key="pastoral.id">
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
      <q-modal minimized v-model="amodalopen">
        <h4 class="text-center">Anniversaries</h4>
        <div class="text-center q-mb-md">
          <q-btn v-if="!anewopen" color="primary" icon="fas fa-plus" @click="addaNote()">&nbsp;add</q-btn>
          <q-btn v-if="anewopen" color="primary" icon="fas fa-plus" @click="saveaNote">&nbsp;save</q-btn>
          <q-btn color="black" class="q-mx-sm" icon="fas fa-times" @click="amodalopen=false">&nbsp;close</q-btn>
          <q-btn v-if="anewopen" color="red" icon="fas fa-trash" @click="deleteaNote()"></q-btn>
        </div>
        <div v-if="anewopen" class="q-mx-md">
          <q-field :error="$v.aform.anniversarydate.$error" error-label="The date field is required">
            <q-datetime float-label="Date" format="YYYY-MM-DD" format-model="string" v-model="aform.anniversarydate" type="date" @blur="$v.aform.anniversarydate.$touch()" :error="$v.aform.anniversarydate.$error" />
          </q-field>
          <q-field :error="$v.aform.details.$error" error-label="The details field is required">
            <q-input float-label="Details" v-model="aform.details" @blur="$v.aform.details.$touch()" :error="$v.aform.details.$error" />
          </q-field>
          <q-field>
            <q-select float-label="Type" v-model="aform.anniversarytype" :options="[
              { label: 'Baptism', value: 'baptism' },
              { label: 'Death', value: 'death' },
              { label: 'Wedding', value: 'wedding' }
            ]"/>
          </q-field>
        </div>
        <q-list v-if="household.specialdays" class="no-border">
          <q-item v-for="sday in household.specialdays" :key="sday.id">
            <q-item-side>
              <small>
                <q-icon class="q-mr-xs cursor-pointer" color="black" name="fas fa-edit" @click.native="editaNote(sday)"></q-icon>
                {{sday.anniversarytype}}<br>
                {{sday.anniversarydate}}
              </small>
            </q-item-side>
            <q-item-main><small>{{sday.details}}</small></q-item-main>
          </q-item>
          <p v-if="!household.specialdays.length"><small>No anniversaries have been added to this household</small></p>
        </q-list>
      </q-modal>
    </div>
    <p class="q-ma-lg text-center caption">{{blocked}}</p>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import leafletmap from './Leafletmap'
export default {
  data () {
    return {
      modalopen: false,
      newopen: false,
      amodalopen: false,
      anewopen: false,
      groupOptions: [],
      form: {
        household_id: '',
        id: '',
        pastoraldate: new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' 00:00:00',
        details: '',
        individual_id: ''
      },
      aform: {
        household_id: '',
        anniversarydate: new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' 00:00:00',
        anniversarytype: '',
        details: ''
      },
      household: {},
      map: null,
      marker: null,
      perm: '',
      blocked: ''
    }
  },
  components: {
    'leafletmap': leafletmap
  },
  validations: {
    form: {
      details: { required },
      pastoraldate: { required }
    },
    aform: {
      details: { required },
      anniversarydate: { required }
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
          if (!this.household.location) {
            if (this.household.society.location) {
              this.household.location = {
                latitude: this.household.society.location.latitude,
                longitude: this.household.society.location.longitude
              }
            } else {
              this.household.location = {
                latitude: -26.1806194,
                longitude: 28.1049816
              }
            }
          }
          this.form.household_id = this.household.id
          this.aform.household_id = this.household.id
          this.perm = this.$store.state.user.societies[this.household.society_id]
          if (this.$store.state.user.level < 5) {
            this.perm = 'editor'
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
      this.$router.push({name: 'householdform', params: { id: this.$route.params.id, action: 'edit', scope: 'society' }})
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
    addaNote () {
      this.aform.id = ''
      this.aform.details = ''
      this.aform.anniversarydate = new Date().toJSON().slice(0, 10).replace(/-/g, '/') + ' 00:00:00'
      this.aform.anniversarytype = ''
      this.anewopen = true
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
        })
    },
    deleteaNote () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/specialdays/' + this.aform.id)
        .then(response => {
          for (var andx in this.household.specialdays) {
            if (this.household.specialdays[andx].id === this.aform.id) {
              this.household.specialdays.splice(andx, 1)
            }
          }
          this.$q.notify(response.data)
          this.amodalopen = false
        })
        .catch(function (error) {
          console.log(error)
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
    saveaNote () {
      this.$v.aform.$touch()
      if (this.$v.aform.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/specialdays',
          {
            specialday: this.aform
          })
          .then(response => {
            if (response.data.message === 'Pastoral note has been created') {
              this.household.specialdays.unshift(response.data.specialday)
            }
            this.$q.notify(response.data.message)
            this.amodalopen = false
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
    editaNote (note) {
      this.aform = note
      this.anewopen = true
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
  h4 {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .q-chip .q-icon {
    font-size: 16px;
  }
  #map {
    position: 'absolute';
    top: 0;
    bottom: 0;
    width: 300px;
    height: '100%';
  }
</style>
