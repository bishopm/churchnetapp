<template>
  <div v-if="household" class="text-center layout-padding">
    <p class="caption">{{household.addressee}} <q-icon class="cursor-pointer" @click.native="editHousehold" name="edit"></q-icon></p>
    <p class="text-left q-mx-md">
      <q-icon name="place" color="tertiary"></q-icon> {{household.addr1}} {{household.addr2}} {{household.addr3}}<br>
      <q-icon name="email" color="tertiary"></q-icon> {{household.post1}} {{household.post2}} {{household.post3}}<br>
      <q-icon name="phone" color="tertiary"></q-icon> {{household.homephone}}
    </p>
    <q-tabs color="secondary" no-pane-border align="justify">
      <q-tab v-for="(individual, ndx) in household.individuals" :default="!ndx" :key="individual.id" slot="title" :name="'tab' + individual.id" :label="individual.firstname"/>
      <q-tab-pane v-for="individual in household.individuals" :key="individual.id" :name="'tab' + individual.id">
        <q-icon v-if="individual.surname" name="person" color="primary"></q-icon> {{individual.title}} {{individual.firstname}} {{individual.surname}}<br>
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
      household: {}
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
      .then((response) => {
        this.household = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    editHousehold () {
      this.$router.push({name: 'householdform', params: { id: this.$route.params.id, action: 'edit' }})
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
