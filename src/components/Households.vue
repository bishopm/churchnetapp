<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All households</p>
      <q-search class="q-ml-md" @input="searchdb" v-model="search" placeholder="search by addressee" />
      <q-item v-if="households" v-for="household in households" :key="household.id" :to="'/households/' + household.id">
        {{household.addressee}}
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addHousehold" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      households: [],
      search: ''
    }
  },
  methods: {
    addHousehold () {
      this.$router.push({name: 'addhousehold'})
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/households/search',
        {
          search: this.search
        })
        .then(response => {
          this.households = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.$q.loading.show()
    this.searchdb()
  }

}
</script>

<style>
</style>
