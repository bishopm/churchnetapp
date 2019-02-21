<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} HOUSEHOLD
    </div>
    <societyselect v-if="$route.params.action === 'add' && $route.params.scope === 'society'" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
    <div class="q-ma-md" v-if="$route.params.action === 'add' && $route.params.scope === 'circuit'">
      <circuitselect @altered="setsocieties" :perms="['editor','admin']" showme="1"></circuitselect>
      <q-select float-label="Society" v-model="society" :options="csocietyOptions" @input="setMap()">
      </q-select>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.addressee.$error" error-label="The addressee field is required">
        <q-input float-label="Addressee" v-model="form.addressee" @blur="$v.form.addressee.$touch()" :error="$v.form.addressee.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-input float-label="Residential Address" v-model="form.addr1"/>
      <q-input v-model="form.addr2"/>
      <q-input v-model="form.addr3"/>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.homephone.$error" error-label="Phone numbers must be numeric">
        <q-input float-label="Home phone" v-model="form.homephone" @blur="$v.form.homephone.$touch()" :error="$v.form.homephone.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Household cellphone" v-model="form.householdcell" :options="housecellOptions"/>
    </div>
    <div id="map" class="q-mt-md"></div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="black">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
import circuitselect from './../Circuitselect'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        addressee: '',
        addr1: '',
        addr2: '',
        addr3: '',
        homephone: ''
      },
      map: '',
      latitude: '',
      longitude: '',
      marker: '',
      housecellOptions: [],
      csocietyOptions: [],
      society: {
        value: '',
        label: ''
      },
      soc: ''
    }
  },
  validations: {
    form: {
      addressee: { required },
      homephone: { numeric }
    }
  },
  components: {
    'societyselect': societyselect,
    'circuitselect': circuitselect
  },
  methods: {
    setsocieties () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/societies/search',
        {
          search: '',
          circuits: this.$store.state.circuitfilter
        })
        .then(response => {
          for (var skey in response.data) {
            var newitem = {
              label: response.data[skey].society,
              value: {
                id: response.data[skey].id,
                lat: response.data[skey].latitude,
                lng: response.data[skey].longitude
              }
            }
            this.csocietyOptions.push(newitem)
          }
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    setMap () {
      this.latitude = this.society.lat
      this.longitude = this.society.lng
      this.$mapbox.accessToken = 'pk.eyJ1IjoiYmlzaG9wbSIsImEiOiJjanNjenJ3MHMwcWRyM3lsbmdoaDU3ejI5In0.M1x6KVBqYxC2ro36_Ipz_w'
      var map = new this.$mapbox.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v9', // stylesheet location
        center: [this.household.location.longitude, this.household.location.latitude], // starting position
        zoom: 13 // starting zoom
      })
      map.addControl(new this.$mapbox.FullscreenControl())
      var popup = new this.$mapbox.Popup({ offset: 25 })
        .setText(this.household.addressee)
      new this.$mapbox.Marker({ color: '#4d7227' })
        .setLngLat([this.household.location.longitude, this.household.location.latitude])
        .setPopup(popup)
        .addTo(map)
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'edit') {
          this.latitude = this.marker.position.lat().toString()
          this.longitude = this.marker.position.lng().toString()
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/households/' + this.form.id,
            {
              addressee: this.form.addressee,
              addr1: this.form.addr1,
              addr2: this.form.addr2,
              addr3: this.form.addr3,
              homephone: this.form.homephone,
              householdcell: this.form.householdcell,
              latitude: this.latitude,
              longitude: this.longitude
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Household updated')
              this.$router.push({ name: 'household', params: { id: response.data.id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          if (this.$route.params.scope === 'circuit') {
            this.soc = this.society.id
          } else {
            this.soc = this.$store.state.select
          }
          this.$axios.post(process.env.API + '/households',
            {
              addressee: this.form.addressee,
              addr1: this.form.addr1,
              addr2: this.form.addr2,
              addr3: this.form.addr3,
              homephone: this.form.homephone,
              householdcell: this.form.householdcell,
              society_id: this.soc,
              latitude: this.latitude,
              longitude: this.longitude
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Household added')
              this.$router.push({ name: 'household', params: { id: response.data.id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    },
    initMap () {
      this.$google()
      this.latitude = this.$store.state.user.societies.full[this.form.society_id].location.latitude
      this.longitude = this.$store.state.user.societies.full[this.form.society_id].location.longitude
      this.$mapbox.accessToken = 'pk.eyJ1IjoiYmlzaG9wbSIsImEiOiJjanNjenJ3MHMwcWRyM3lsbmdoaDU3ejI5In0.M1x6KVBqYxC2ro36_Ipz_w'
      this.map = new this.$mapbox.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v9', // stylesheet location
        center: [this.household.location.longitude, this.household.location.latitude], // starting position
        zoom: 13 // starting zoom
      })
      this.map.addControl(new this.$mapbox.FullscreenControl())
      var popup = new this.$mapbox.Popup({ offset: 25 })
        .setText(this.household.addressee)
      this.marker = new this.$mapbox.Marker({ color: '#4d7227' })
        .setLngLat([this.household.location.longitude, this.household.location.latitude])
        .setPopup(popup)
        .addTo(this.map)
    }
  },
  mounted () {
    this.setsocieties()
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/households/' + this.$route.params.id)
        .then((response) => {
          this.form = response.data
          for (var ikey in this.form.individuals) {
            var newitem = {
              label: this.form.individuals[ikey].firstname,
              value: this.form.individuals[ikey].id
            }
            if (this.form.individuals[ikey].cellphone) {
              this.housecellOptions.push(newitem)
            }
          }
          this.initMap()
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.initMap()
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
</style>
