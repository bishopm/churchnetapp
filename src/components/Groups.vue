<template>
  <div>
    <q-list v-if="groups" class="no-border">
      <p class="caption text-center">All groups</p>
      <societyfilter class="q-mx-md" @altered="searchdb" :showme="showme()" initial="all"></societyfilter>
      <q-search ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by group name" />
      <q-item v-for="group in groups" :key="group.id" :to="'/groups/' + group.id">
        {{group.groupname}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addGroup" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
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
      this.$router.push({name: 'groupform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    searchdb () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/groups/search',
        {
          search: this.search,
          societies: this.$store.state.societyfilter
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
    this.$refs.search.focus()
    this.searchdb()
  }

}
</script>

<style>
</style>
