<template>
  <div class="text-center layout-padding">
    <p class="caption" v-if="title">{{title}} a society</p>
    <circuitselect :perms="['edit','admin']"></circuitselect>
    <div id="map" class="q-mt-md"></div>
    <p>Drag the marker to the correct position</p>
    <form>
      <q-tabs v-model="selectedTab" color="primary" class="no-border" q-tabs-two-lines>
        <q-tab default slot="title" name="contactDetails">Contact</q-tab>
        <q-tab slot="title" name="adminDetails">Admin</q-tab>
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
        <q-tab-pane name="adminDetails" class="no-border">
          <div class="q-mt-sm">
            <q-field>
              <q-input float-label="Journey App feed" v-model="form.journey" />
            </q-field>
          </div>
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
            <q-field>
              <q-input float-label="BulkSMS user" v-model="form.bulksms_user" />
            </q-field>
          </div>
          <div class="q-mt-sm">
            <q-field>
              <q-input type="password" float-label="BulkSMS password" v-model="form.bulksms_pw" />
            </q-field>
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
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.post(process.env.API + '/addsociety',
          {
            society: this.form,
            latitude: localStorage.getItem('CHURCHNET_newLat'),
            longitude: localStorage.getItem('CHURCHNET_newLng'),
            circuit_id: this.$store.state.select
          })
          .then(response => {
            this.$q.loading.hide()
            this.$router.push({ name: 'society', params: { id: response.data.id } })
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    },
    initMap () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          var latlng = new window.google.maps.LatLng(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
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
    localStorage.removeItem('CHURCHNET_newLat')
    localStorage.removeItem('CHURCHNET_newLng')
    await this.$google()
    this.initMap()
    if (this.$route.params.action === 'edit') {
      this.society = JSON.parse(this.$route.params.society)
      this.form = this.society
    } else {
      // pass
    }
  }
}
</script>

<style>
#map {
  text-align:center;
  height: 200px;
  width: 100%;
}
</style>
