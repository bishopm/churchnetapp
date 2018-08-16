<template>
  <div class="layout-padding">
    <q-tabs position="top" color="primary">
      <q-tab default slot="title" name="tab-1" icon="lock_open" label="Login"/>
      <q-tab slot="title" name="tab-2" icon="create" label="Register"/>
      <q-tab-pane class="no-border" name="tab-1">
        <div class="alert alert-danger" v-if="error">
          <p>There was an error, unable to sign in with those credentials.</p>
        </div>
        <form autocomplete="off" @submit.prevent="login" method="post">
          <div class="q-pa-sm">
            <q-input float-label="Email" type="email" v-model="email" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Password" type="password" v-model="password" required />
          </div>
          <div class="q-pa-sm text-center">
            <q-btn @click="login">Sign in</q-btn>
          </div>
        </form>
      </q-tab-pane>
      <q-tab-pane class="no-border" name="tab-2">
        <form autocomplete="off" @submit.prevent="login" method="post">
          <div class="q-pa-sm">
            <q-input float-label="Name" v-model="newname" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Email" type="email" v-model="newemail" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Password" type="password" v-model="newpassword" required />
          </div>
          <div class="q-pa-sm text-center">
            <q-btn @click="register">Register</q-btn>
          </div>
        </form>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',

      password: '',
      newpassword: '',
      newemail: '',
      newname: '',
      error: 0
    }
  },
  methods: {
    login () {
      this.$axios.post(this.$store.state.hostname + '/login',
        {
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log(response.data)
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
          this.$store.commit('setToken', response.data.token)
          localStorage.setItem('CHURCHNET_Token', response.data.token)
          localStorage.setItem('CHURCHNET_user_id', response.data.user.id)
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.get(this.$store.state.hostname + '/users/' + localStorage.getItem('CHURCHNET_user_id'))
            .then((response) => {
              this.$store.commit('setUser', response.data)
              for (var skey in this.$store.state.user.societies) {
                this.socs.push(this.$store.state.user.societies[skey].id.toString())
              }
              this.$store.commit('setSocieties', this.socs)
              for (var ckey in this.$store.state.user.circuits) {
                this.circs.push(this.$store.state.user.circuits[ckey].id.toString())
              }
              this.$store.commit('setCircuits', this.circs)
              this.$router.push({ name: 'home' })
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(function (error) {
          this.error = error
        })
    },
    register () {
      this.$axios.post(this.$store.state.hostname + '/users/register',
        {
          email: this.newemail,
          password: this.newpassword,
          name: this.newname
        })
        .then(response => {
          this.email = this.newemail
          this.password = this.newpassword
          this.login()
        })
        .catch(function (error) {
          this.error = error
        })
    }
  }
}
</script>

<style>
</style>
