<template>
  <div>
    <leafletmap v-if="household.location" :latitude="household.location.latitude" :longitude="household.location.longitude" :popuplabel="household.addressee" editable="yes" @newlat="newlat" @newlng="newlng"></leafletmap>
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
      <q-field :error="$v.household.addressee.$error" error-label="The addressee field is required">
        <q-input float-label="Addressee" v-model="household.addressee" @blur="$v.household.addressee.$touch()" :error="$v.household.addressee.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-input float-label="Residential Address" v-model="household.location.address"/>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.household.location.phone.$error" error-label="Phone numbers must be numeric">
        <q-input float-label="Home phone" v-model="household.location.phone" @blur="$v.household.location.phone.$touch()" :error="$v.household.location.phone.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-select float-label="Household cellphone" v-model="household.householdcell" :options="housecellOptions"/>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" @click="deleteHousehold" color="black">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
import circuitselect from './../Circuitselect'
import leafletmap from './../Leafletmap'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      household: {
        addressee: '',
        addr1: '',
        addr2: '',
        addr3: '',
        location: {
          longitude: '',
          latitude: '',
          address: '',
          phone: ''
        }
      },
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
    household: {
      addressee: { required },
      location: {
        phone: { numeric }
      }
    }
  },
  components: {
    'societyselect': societyselect,
    'circuitselect': circuitselect,
    'leafletmap': leafletmap
  },
  methods: {
    setsocieties () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/societies/search',
        {
          search: '',
          circuits: this.$store.state.user.circuits.keys
        })
        .then(response => {
          for (var skey in response.data) {
            if (response.data[skey].location) {
              var slat = response.data[skey].location.latitude
              var slng = response.data[skey].location.longitude
            } else {
              slat = -29.8579
              slng = 31.0292
            }
            var newitem = {
              label: response.data[skey].society,
              value: {
                id: response.data[skey].id,
                lat: slat,
                lng: slng
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
    newlat (coord) {
      this.household.location.latitude = coord
    },
    newlng (coord) {
      this.household.location.longitude = coord
    },
    setMap () {
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
    deleteHousehold () {
      this.$q.dialog({
        title: 'Confirm deletion',
        message: 'Are you sure you want to delete this household and its members?',
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/households/delete',
          {
            id: this.household.id
          })
          .then(response => {
            this.$q.notify('Household deleted')
            this.$router.push({ name: 'households' })
          })
          .catch(function (error) {
            console.log(error)
          })
      }).catch(() => {
        console.log('Cancelling deletion')
      })
    },
    submit () {
      this.$v.household.$touch()
      if (this.$v.household.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'edit') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/households/' + this.household.id,
            {
              addressee: this.household.addressee,
              addr1: this.household.addr1,
              addr2: this.household.addr2,
              addr3: this.household.addr3,
              homephone: this.household.location.phone,
              householdcell: this.household.householdcell,
              latitude: this.household.location.latitude,
              longitude: this.household.location.longitude
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
              addressee: this.household.addressee,
              addr1: this.household.addr1,
              addr2: this.household.addr2,
              addr3: this.household.addr3,
              homephone: this.household.homephone,
              householdcell: this.household.householdcell,
              society_id: this.soc,
              latitude: this.household.location.latitude,
              longitude: this.household.location.longitude
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
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/households/' + this.$route.params.id)
        .then((response) => {
          this.household = response.data
          for (var ikey in this.household.individuals) {
            var newitem = {
              label: this.household.individuals[ikey].firstname,
              value: this.household.individuals[ikey].id
            }
            if (this.household.individuals[ikey].cellphone) {
              this.housecellOptions.push(newitem)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.setsocieties()
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
