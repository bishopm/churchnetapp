<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Admin and editor Users</p>
      <q-item v-for="user in users" :key="user.id" :to="'/users/' + user.id">
        <q-item-main><b>{{user.name}}</b></q-item-main>
        <q-item-side><small>{{user.email}}</small></q-item-side>
      </q-item>
      <div class="text-center">{{emptymessage}}</div>
    </q-list>
    <q-btn round color="primary" @click="addUser" class="fixed" icon="add" style="right: 18px; top: 78px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [],
      emptymessage: '',
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
      this.$axios.get(process.env.API + '/users')
        .then(response => {
          this.users = response.data
          if (!this.users.length) {
            this.emptymessage = 'No editor or admin users have been created yet'
          }
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
