<template>
  <div v-if="household" class="text-center layout-padding">
    <p class="caption">{{household.addressee}}</p>
    <p class="text-left q-mx-md">
      <q-icon name="place" color="tertiary"></q-icon> {{household.addr1}} {{household.addr2}} {{household.addr3}}<br>
      <q-icon name="email" color="tertiary"></q-icon> {{household.post1}} {{household.post2}} {{household.post3}}<br>
      <q-icon name="phone" color="tertiary"></q-icon> {{household.homephone}}
    </p>
    <q-tabs color="secondary" no-pane-border align="justify">
      <q-tab v-for="(individual, ndx) in household.individuals" :default="!ndx" :key="individual.id" slot="title" :name="'tab' + individual.id" :label="individual.firstname"/>
      <q-tab-pane v-for="individual in household.individuals" :key="individual.id" :name="'tab' + individual.id">{{individual}}</q-tab-pane>
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
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/households/' + this.$route.params.id)
      .then((response) => {
        this.household = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
</style>
