<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All groups</p>
      <societyfilter @altered="searchdb"></societyfilter>
      <q-search class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by group name" />
      <q-item v-if="groups" v-for="group in groups" :key="group.id" :to="'/groups/' + group.id">
        {{group.groupname}}
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addGroup" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
export default {
  data () {
    return {
      groups: [],
      search: ''
    }
  },
  components: {
    'societyfilter': societyfilter
  },
  methods: {
    addGroup () {
      this.$router.push({name: 'addgroup'})
    },
    searchdb () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(this.$store.state.hostname + '/groups/search',
        {
          search: this.search,
          societies: this.$store.state.societies
        })
        .then(response => {
          this.groups = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
  }

}
</script>

<style>
</style>
