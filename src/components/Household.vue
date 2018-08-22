<template>
  <div v-if="household" class="text-center layout-padding">
    <p class="caption q-mt-md">{{household.addressee}} <q-icon v-if="canedit()" class="cursor-pointer" @click.native="editHousehold" name="edit"></q-icon></p>
    <p class="text-left q-mx-md">
      <q-icon name="place" color="secondary"></q-icon> {{household.addr1}} {{household.addr2}} {{household.addr3}}<br>
      <q-icon name="email" color="secondary"></q-icon> {{household.post1}} {{household.post2}} {{household.post3}}<br>
      <q-icon name="phone" color="secondary"></q-icon> {{household.homephone}}
    </p>
    <div id="map" class="q-mt-md"></div>
    <q-tabs color="secondary" no-pane-border align="justify">
      <q-tab v-for="(individual, ndx) in household.individuals" :default="!ndx" :key="individual.id" slot="title" :name="'tab' + individual.id" :label="individual.firstname"/>
      <q-tab-pane v-for="individual in household.individuals" :key="individual.id" :name="'tab' + individual.id">
        <q-icon v-if="individual.surname" name="person" color="primary"></q-icon> {{individual.title}} {{individual.firstname}} {{individual.surname}} <q-icon v-if="canedit()" class="cursor-pointer" @click.native="editIndividual(individual)" name="edit"></q-icon><br>
        <q-icon v-if="individual.cellphone" name="phone" color="primary"></q-icon> {{individual.cellphone}}<br>
        <q-icon v-if="individual.email" name="email" color="primary"></q-icon> {{individual.email}}<br>
        <q-icon v-if="individual.memberstatus" name="account_box" color="memberstatus"></q-icon> {{individual.memberstatus}}<br>
        <p class="caption q-mt-md">Groups</p>
        <div class="text-justify">
          <q-chip class="q-ma-xs" small color="primary" v-for="group in individual.groups" :key="group.id"><router-link :to="'/groups/' + group.id">{{group.groupname}}</router-link></q-chip>
        </div>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      household: {},
      map: null,
      marker: null
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
      .then((response) => {
        this.household = response.data
        this.initMap()
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    canedit () {
      return false
    },
    editHousehold () {
      this.$router.push({name: 'householdform', params: { id: this.$route.params.id, action: 'edit' }})
    },
    editIndividual (individual) {
      this.$router.push({name: 'individualform', params: { individual: individual, action: 'edit' }})
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
