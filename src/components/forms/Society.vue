<template>
  <div class="text-center layout-padding">
    <p class="caption" v-if="title">{{title}} a society</p>
    <circuitselect :perms="['editor','admin']"></circuitselect>
    <div id="map" class="q-mt-md"></div>
    <p>Drag the marker to the correct position</p>
    <form>
      <q-tabs color="primary" class="no-border" align="justify" q-tabs-two-lines>
        <q-tab default slot="title" name="contactDetails">Contact</q-tab>
        <q-tab slot="title" name="featureDetails">Features</q-tab>
        <q-tab slot="title" name="messageDetails">Messaging</q-tab>
        <q-tab-pane name="contactDetails" class="no-border">
          <div>
            <q-field :error="$v.form.society.$error" error-label="The society name field is required">
              <q-input float-label="Society name" v-model="form.society" @blur="$v.form.society.$touch()" :error="$v.form.society.$error" />
            </q-field>
          </div>
          <div>
            <q-field>
              <q-input float-label="Address" v-model="form.address" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Contact" v-model="form.contact" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Website" v-model="form.website" />
            </q-field>
          </div>
        </q-tab-pane>
        <q-tab-pane name="featureDetails" class="no-border">
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Send a weekly birthday email</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-select float-label="Birthday email group" v-model="form.birthday_group" :options="groupOptions"/>
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-select float-label="Birthday email day" v-model="form.birthday_day" :options="[{ label: 'Sunday', value: 0 }, { label: 'Monday', value: 1 }, { label: 'Tuesday', value: 2 }, { label: 'Wednesday', value: 3 }, { label: 'Thursday', value: 4 }, { label: 'Friday', value: 5 }, { label: 'Saturday', value: 6 }]"/>
            </div>
          </div>
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Send regular giving reports</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-select float-label="Giving administrator" v-model="form.giving_user" :options="userOptions"/>
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Giving lag time" v-model="form.giving_lag" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <div class="q-mt-sm">
                <q-select float-label="Giving reports per year" v-model="form.giving_reports" :options="[{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '6', value: 6 }, { label: '12', value: 12 }]"/>
              </div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Journey App feed" v-model="form.journey" />
            </q-field>
          </div>
        </q-tab-pane>
        <q-tab-pane name="messageDetails" class="no-border">
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Email settings</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email username" v-model="form.email_user" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input type="password" float-label="Email password" v-model="form.email_pw" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email host name" v-model="form.email_host" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email port" v-model="form.email_port" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-select float-label="Email encryption" v-model="form.email_encryption" :options="[{ label: 'Transport Layer Security (TLS)', value: 'tls' }, { label: 'Secure Sockets Layer (SSL)', value: 'ssl' }, { label: 'No encryption', value: 'null' }]"/>
            </div>
          </div>
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>SMS settings</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="BulkSMS user" v-model="form.bulksms_user" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input type="password" float-label="BulkSMS password" v-model="form.bulksms_pw" />
              </q-field>
            </div>
          </div>
        </q-tab-pane>
      </q-tabs>
      <div class="q-ma-lg text-center">
        <q-btn @click="submit()" color="primary">OK</q-btn>
        <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import circuitselect from './../Circuitselect'
import { required } from 'vuelidate/lib/validators'
import { format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      groupOptions: [],
      userOptions: [],
      societies: [],
      society: {},
      marker: {},
      map: {},
      form: {}
    }
  },
  validations: {
    form: {
      society: { required }
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      this.form.circuit_id = this.$store.state.select
      this.form.latitude = localStorage.getItem('CHURCHNET_newLat')
      this.form.longitude = localStorage.getItem('CHURCHNET_newLng')
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.post(process.env.API + '/addsociety',
            {
              society: this.society
            })
            .then(response => {
              this.$q.loading.hide()
              this.$router.go(-1)
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.post(process.env.API + '/societies/update',
            {
              society: this.society
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Society has been updated')
              this.$router.go(-1)
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    },
    initMap () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          if (this.$route.params.action === 'add') {
            var latlng = new window.google.maps.LatLng(
              {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              })
          } else {
            latlng = new window.google.maps.LatLng(
              {
                lat: this.society.latitude,
                lng: this.society.longitude
              })
          }
          localStorage.setItem('CHURCHNET_newLat', latlng.lat())
          localStorage.setItem('CHURCHNET_newLng', latlng.lng())
          this.map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: latlng
          })
          this.marker = new window.google.maps.Marker({
            position: latlng,
            map: this.map,
            draggable: true
          })
          this.marker.addListener('dragend', function () {
            localStorage.setItem('CHURCHNET_newLat', this.position.lat())
            localStorage.setItem('CHURCHNET_newLng', this.position.lng())
          })
        })
      } else {
        console.log('Browser cannot')
      }
    }
  },
  async mounted () {
    if (this.$route.params.action === 'edit') {
      this.society = JSON.parse(this.$route.params.society)
      this.form = this.society
      this.form.latitude = parseFloat(this.society.latitude)
      this.form.longitude = parseFloat(this.society.longitude)
    } else {
      // pass
    }
    this.societies.push(this.society.id)
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/groups/search',
      {
        search: '',
        societies: this.societies
      })
      .then(response => {
        this.groupOptions = []
        for (var gkey in response.data) {
          var newitem = {
            label: response.data[gkey].groupname,
            value: response.data[gkey].id
          }
          this.groupOptions.push(newitem)
        }
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
    localStorage.removeItem('CHURCHNET_newLat')
    localStorage.removeItem('CHURCHNET_newLng')
    this.userOptions = []
    for (var ukey in this.society.users) {
      var newitem2 = {
        label: this.society.users[ukey].name,
        value: this.society.users[ukey].id
      }
      this.userOptions.push(newitem2)
    }
    await this.$google()
    this.initMap()
  }
}
</script>

<style>
#map {
  text-align:center;
  height: 200px;
  width: 100%;
}
.bg-lightgrey {
  background-color: #eeeeee;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
}
</style>
