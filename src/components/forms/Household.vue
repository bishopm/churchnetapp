<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} HOUSEHOLD
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
    <div class="q-ma-md">
      <q-btn color="primary" @click="submit">Submit</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
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
      marker: '',
      housecellOptions: []
    }
  },
  validations: {
    form: {
      addressee: { required },
      homephone: { numeric }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      this.form.latitude = this.marker.position.lat().toString()
      this.form.longitude = this.marker.position.lng().toString()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        // if action = edit / add
        this.$q.notify('Good to go!')
      }
    },
    initMap () {
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(this.form.latitude), lng: parseFloat(this.form.longitude)},
        zoom: 15
      })
      this.marker = new window.google.maps.Marker({position: {lat: parseFloat(this.form.latitude), lng: parseFloat(this.form.longitude)}, map: this.map, draggable: true})
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
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
