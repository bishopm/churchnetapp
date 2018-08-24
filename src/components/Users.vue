<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Users</p>
      <q-item v-for="user in users" :key="user.id" :to="'/users/' + user.id">
        <q-item-main><b>{{user.name}}</b></q-item-main>
        <q-item-side><small>{{user.email}}</small></q-item-side>
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addUser" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [],
      search: ''
    }
  },
  methods: {
    addUser () {
      this.$router.push({name: 'addsociety'})
    }
  },
  mounted () {
    this.$q.loading.show()
    if (this.$store.state.user.societies) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(this.$store.state.hostname + '/users')
        .then(response => {
          this.users = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  }

}
</script>

<style>
</style>
