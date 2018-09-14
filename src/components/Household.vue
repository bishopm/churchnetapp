<template>
  <div v-if="household.addressee" class="text-center layout-padding">
    <p class="caption q-mt-md">{{household.addressee}} <q-icon v-if="perm === 'edit'" class="cursor-pointer" @click.native="editHousehold" name="edit"></q-icon></p>
    <p class="text-left q-mx-md">
      <q-icon name="place" color="secondary"></q-icon> {{household.addr1}} {{household.addr2}} {{household.addr3}}<br>
      <q-icon name="phone" color="secondary"></q-icon> {{household.homephone}}
    </p>
    <div id="map" class="q-mt-md"></div>
    <div v-if="household.individuals.length">
      <q-tabs color="secondary" no-pane-border align="justify">
        <q-tab v-for="(individual, ndx) in household.individuals" :default="!ndx" :key="individual.id" slot="title" :name="'tab' + individual.id" :label="individual.firstname"/>
        <q-tab-pane v-for="individual in household.individuals" :key="individual.id" :name="'tab' + individual.id">
          <q-icon v-if="individual.surname" name="person" color="primary"></q-icon> {{individual.title}} {{individual.firstname}} {{individual.surname}} <q-icon v-if="perm === 'edit'" class="cursor-pointer" @click.native="editIndividual(individual)" name="edit"></q-icon><br>
          <q-icon v-if="individual.cellphone" name="phone" color="primary"></q-icon> {{individual.cellphone}}<br>
          <q-icon v-if="individual.email" name="email" color="primary"></q-icon> {{individual.email}}<br>
          <q-icon v-if="individual.memberstatus" name="account_box" color="memberstatus"></q-icon> {{individual.memberstatus}}<br>
          <div v-if="individual.tags">
            <q-chip class="q-ma-xs" small color="secondary" v-for="tag in individual.tags" :key="tag.id">{{tag.name}}</q-chip>
          </div>
          <p class="caption q-mt-md">Groups</p>
          <div class="text-justify">
            <q-chip class="q-ma-xs" small color="primary" v-for="group in individual.groups" :key="group.id"><router-link :to="'/groups/' + group.id">{{group.groupname}}</router-link></q-chip>
          </div>
        </q-tab-pane>
        <q-tab key="0" slot="title" name="tabadd" icon="add_circle"/>
        <q-tab-pane name="tabadd">
          <q-btn @click.native="addIndividual()">Add a new member to this household</q-btn>
        </q-tab-pane>
      </q-tabs>
    </div>
    <div v-else class="q-mt-md">
      <p>No household members have been added yet</p>
      <q-btn class="q-mt-md" color="secondary" @click="addIndividual()">Add an individual</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      household: {},
      map: null,
      marker: null,
      perm: ''
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
      .then((response) => {
        this.household = response.data
        this.perm = this.$store.state.user.societies[this.household.society_id]
        this.initMap()
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
      this.$router.push({name: 'individualform', params: { individual: {household_id: this.household.id, surname: this.household.sortsurname, sex: 'female'}, action: 'add' }})
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
