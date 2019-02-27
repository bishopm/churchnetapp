<template>
  <div class="text-center layout-padding">
    <p class="caption" v-if="title">{{title}} a society</p>
    <circuitselect :perms="['editor','admin']"></circuitselect>
    <leafletmap v-if="society.location.latitude" :latitude="society.location.latitude" :longitude="society.location.longitude" :popuplabel="society.society" editable="yes" @newlat="newlat" @newlng="newlng"></leafletmap>
    <p>Drag the marker to the correct position</p>
    <form>
      <q-tabs color="primary" class="no-border" align="justify" q-tabs-two-lines>
        <q-tab default slot="title" name="contactDetails">Contact</q-tab>
        <q-tab slot="title" name="featureDetails">Features</q-tab>
        <q-tab slot="title" name="messageDetails">Messaging</q-tab>
        <q-tab-pane name="contactDetails" class="no-border">
          <div>
            <q-field :error="$v.society.society.$error" error-label="The society name field is required">
              <q-input float-label="Society name" v-model="society.society" @blur="$v.society.society.$touch()" :error="$v.society.society.$error" />
            </q-field>
          </div>
          <div>
            <q-field>
              <q-input float-label="Address" v-model="society.location.address" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Phone" v-model="society.location.phone" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Website" v-model="society.website" />
            </q-field>
          </div>
        </q-tab-pane>
        <q-tab-pane name="featureDetails" class="no-border">
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Send a weekly birthday email</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-select float-label="Birthday email group" v-model="society.birthday_group" :options="groupOptions"/>
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-select float-label="Birthday email day" v-model="society.birthday_day" :options="[{ label: 'Sunday', value: 0 }, { label: 'Monday', value: 1 }, { label: 'Tuesday', value: 2 }, { label: 'Wednesday', value: 3 }, { label: 'Thursday', value: 4 }, { label: 'Friday', value: 5 }, { label: 'Saturday', value: 6 }]"/>
            </div>
          </div>
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Send regular giving reports</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-select float-label="Giving administrator" v-model="society.giving_user" :options="userOptions"/>
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Giving lag time" v-model="society.giving_lag" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <div class="q-mt-sm">
                <q-select float-label="Giving reports per year" v-model="society.giving_reports" :options="[{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '6', value: 6 }, { label: '12', value: 12 }]"/>
              </div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Journey App feed" v-model="society.journey" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-select float-label="Pastoral group" v-model="society.pastoral_group" :options="groupOptions"/>
            </q-field>
          </div>
        </q-tab-pane>
        <q-tab-pane name="messageDetails" class="no-border">
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>Email settings</b></div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email username" v-model="society.email_user" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input type="password" float-label="Email password" v-model="society.email_pw" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email host name" v-model="society.email_host" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Email port" v-model="society.email_port" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-select float-label="Email encryption" v-model="society.email_encryption" :options="[{ label: 'Transport Layer Security (TLS)', value: 'tls' }, { label: 'Secure Sockets Layer (SSL)', value: 'ssl' }, { label: 'No encryption', value: 'null' }]"/>
            </div>
          </div>
          <div class="card bg-lightgrey">
            <div class="text-left caption"><b>SMS settings</b></div>
            <div class="q-mt-sm">
              <q-select float-label="SMS service" v-model="society.sms_service" :options="[{ label: 'BulkSMS', value: 'bulksms' }, { label: 'SMS Portal', value: 'smsportal' }]"/>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input float-label="Username / client ID" v-model="society.sms_user" />
              </q-field>
            </div>
            <div class="q-mt-sm">
              <q-field>
                <q-input type="password" float-label="Password / API secret" v-model="society.sms_pw" />
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
import leafletmap from './../Leafletmap'
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
      society: {
        location: {
          longitude: '',
          latitude: '',
          address: '',
          phone: ''
        }
      }
    }
  },
  validations: {
    society: {
      society: { required }
    }
  },
  components: {
    'circuitselect': circuitselect,
    'leafletmap': leafletmap
  },
  async mounted () {
    if (this.$route.params.action === 'edit') {
      this.society = JSON.parse(this.$route.params.society)
      this.society.location.latitude = parseFloat(this.society.location.latitude)
      this.society.location.longitude = parseFloat(this.society.location.longitude)
    } else {
      this.initMap()
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
    this.userOptions = []
    for (var ukey in this.society.users) {
      var newitem2 = {
        label: this.society.users[ukey].name,
        value: this.society.users[ukey].id
      }
      this.userOptions.push(newitem2)
    }
  },
  methods: {
    newlat (coord) {
      this.society.location.latitude = coord
    },
    newlng (coord) {
      this.society.location.longitude = coord
    },
    submit () {
      this.$v.society.$touch()
      this.society.circuit_id = this.$store.state.select
      if (this.$v.society.$error) {
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
          this.society.location.latitude = position.coords.latitude
          this.society.location.longitude = position.coords.longitude
        })
      } else {
        this.society.location.latitude = -26.3259639
        this.society.location.longitude = 28.3306651
      }
    }
  }
}
</script>

<style>
#map {
    position: 'absolute';
    top: 0;
    bottom: 0;
    width: 300px;
    height: '100%';
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
