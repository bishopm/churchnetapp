<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All groups</p>
      <q-item v-if="groups" v-for="group in groups" :key="group.id" :to="'/groups/' + group.id">
        {{group.groupname}}
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addGroup" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      groups: []
    }
  },
  methods: {
    addGroup () {
      this.$router.push({name: 'addgroup'})
    }
  },
  mounted () {
    this.$q.loading.show()
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/groups')
      .then(response => {
        this.groups = response.data
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
  }

}
</script>

<style>
</style>
