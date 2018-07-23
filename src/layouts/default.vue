<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration:none;">ChurchNet</router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <div v-if="hassocieties">
          <q-list-header class="text-center"><q-icon name="person"></q-icon> Church members</q-list-header>
          <q-item to="/groups">
            <q-item-side icon="group" />
            <q-item-main label="Groups" sublabel="view all groups" />
          </q-item>
          <q-item to="/households">
            <q-item-side icon="home" />
            <q-item-main label="Households" sublabel="view all households" />
          </q-item>
        </div>
        <div v-if="hascircuits">
          <q-list-header class="text-center"><q-icon name="group_work"></q-icon> Circuit</q-list-header>
          <q-item to="/societies">
            <q-item-side icon="room" />
            <q-item-main label="Societies" sublabel="view all societies" />
          </q-item>
        </div>
        <q-item to="/settings">
          <q-item-side icon="settings" />
          <q-item-main label="Settings" sublabel="user settings" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      socs: [],
      circs: []
    }
  },
  computed: {
    hascircuits () {
      return this.$store.state.hascircuits
    },
    hassocieties () {
      return this.$store.state.hassocieties
    }
  },
  mounted () {
    if (localStorage.getItem('CHURCHNET_user_id')) {
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
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.$router.push({ name: 'settings' })
    }
  }
}
</script>

<style>
</style>
