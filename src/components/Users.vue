<template>
  <div class="q-ma-md">
    <q-list class="no-border">
      <p class="q-my-lg caption text-center">Users</p>
      <q-input class="q-ma-md" outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search by user name">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item v-for="user in users" :key="user.id" :to="'/users/' + user.id">
        <q-item-section><b>{{user.name}}</b><small class="q-ml-md text-primary" v-if="!user.phonetoken">inactive</small>
        </q-item-section>
        <q-item-section><small>{{user.society}} ({{user.circuit}})</small></q-item-section>
      </q-item>
      <div class="text-center">{{emptymessage}}</div>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[17, 12]">
      <q-btn round size="sm" color="primary" @click="addUser" icon="fas fa-plus"/>
    </q-page-sticky>
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
      this.$router.push({ name: 'userform', params: { action: 'add' } })
    },
    searchdb () {
      this.$q.loading.show()
      if (this.$store.state.user.societies) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/users/search',
          {
            search: this.search
          })
          .then(response => {
            this.users = response.data
            if (!this.users.length) {
              this.emptymessage = 'No users meet these search criteria'
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    }
  },
  mounted () {
    this.searchdb()
  }

}
</script>

<style>
.q-item {
  line-height: 1;
}
</style>
