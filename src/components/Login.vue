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
        <div class="text-center">
          <q-btn v-if="!verified" @click="verification">Verify phone number</q-btn>
          <p v-else class="caption">Your phone number has been verified</p>
        </div>
        <form v-if="verified" autocomplete="off" @submit.prevent="login" method="post">
          <div class="q-pa-sm">
            <q-input float-label="Name" v-model="newname" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Email" type="email" v-model="newemail" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Cellphone" v-model="newphone" required readonly />
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
      newphone: localStorage.getItem('CHURCHNET_verifiedphone'),
      error: 0,
      verified: false
    }
  },
  mounted () {
    if (localStorage.getItem('CHURCHNET_verifiedphone')) {
      this.verified = true
    }
  },
  methods: {
    login () {
      this.$axios.post(this.$store.state.hostname + '/churchnet/login',
        {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
          localStorage.setItem('CHURCHNET_Token', response.data.token)
          localStorage.setItem('CHURCHNET_user_id', response.data.user.id)
          this.$router.push({ name: 'home' })
        })
        .catch(function (error) {
          this.error = error
        })
    },
    verification () {
      this.$router.push({name: 'phoneverification'})
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
