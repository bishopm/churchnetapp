<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} venue
    </div>
    <societyselect @altered="setsocieties" v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
    <div class="q-ma-md">
      <q-input outlined label="Venue name" v-model="venue" />
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import societyselect from './../Societyselect'
export default {
  data () {
    return {
      title: this.$route.params.action.charAt(0).toUpperCase() + this.$route.params.action.slice(1),
      id: '',
      venue: ''
    }
  },
  components: {
    'societyselect': societyselect
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/circuits/' + this.society.circuit_id + '/services/' + this.$route.params.service)
        .then((response) => {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
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
    submit () {
      if (this.$route.params.action === 'add') {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
        this.$axios.post(process.env.API + '/venues',
          {
            society_id: this.$store.state.select,
            venue: this.venue
          })
          .then(response => {
            this.$router.go(-1)
          })
          .catch(function (error) {
            this.error = error
          })
      } else {
        this.$axios.post(process.env.API + '/circuits/' + this.society.circuit_id + '/services/' + this.$route.params.service,
          {
            society_id: this.society.id,
            language: this.form.language
          })
          .then(response => {
            console.log(response.data)
            this.$router.go(-1)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
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
