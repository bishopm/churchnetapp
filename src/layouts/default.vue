<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="contacts" />
        </q-btn>
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration:none;">ChurchNet</router-link>
        </q-toolbar-title>
        <q-btn flat dense round v-if="$store.getters.hasEntity('circuits')" @click="rightDrawerOpen = !rightDrawerOpen" aria-label="Menu">
          <q-icon name="people_outline" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <div v-if="$store.getters.hasEntity('societies')">
          <q-list-header class="text-center"><q-icon name="person"></q-icon> Members</q-list-header>
          <q-item to="/communicate">
            <q-item-side icon="phonelink_ring" />
            <q-item-main label="Communication" sublabel="send emails or messages" />
          </q-item>
          <q-item to="/groups">
            <q-item-side icon="group" />
            <q-item-main label="Groups" sublabel="view all groups" />
          </q-item>
          <q-item to="/households">
            <q-item-side icon="home" />
            <q-item-main label="Households" sublabel="view all households" />
          </q-item>
          <q-list-header class="text-center"><q-icon name="person"></q-icon> Society admin</q-list-header>
          <q-item to="/rosters">
            <q-item-side icon="format_list_bulleted" />
            <q-item-main label="Rosters" sublabel="society rosters" />
          </q-item>
          <q-item to="/statistics">
            <q-item-side icon="timeline" />
            <q-item-main label="Statistics" sublabel="view worship service statistics" />
          </q-item>
        </div>
        <q-item v-if="$store.state.user.level === 'publisher' || $store.state.user.level === 'admin'" to="/feeds">
          <q-item-side icon="publish" />
          <q-item-main label="Published content" sublabel="current & historic feed content" />
        </q-item>
        <q-item @click.native="logout()">
          <q-item-side icon="logout" />
          <q-item-main label="Log out" sublabel="log out of ChurchNet" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <q-pull-to-refresh :handler="refresher">
        <router-view :key="$route.fullPath"></router-view>
      </q-pull-to-refresh>
    </q-page-container>
    <q-layout-drawer side="right" v-model="rightDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <div v-if="$store.getters.hasEntity('circuits')">
        <q-list-header class="text-center"><q-icon name="group_work"></q-icon> Circuit</q-list-header>
        <q-item to="/preachers">
          <q-item-side icon="person" />
          <q-item-main label="Preachers" sublabel="circuit preachers and ministers" />
        </q-item>
        <q-item to="/plan">
          <q-item-side icon="mic" />
          <q-item-main label="Plan" sublabel="preaching plan" />
        </q-item>
        <q-item to="/societies">
          <q-item-side icon="room" />
          <q-item-main label="Societies" sublabel="view all societies" />
        </q-item>
        <q-item to="/circuithouseholds">
          <q-item-side icon="home" />
          <q-item-main label="Households" sublabel="view all circuit households" />
        </q-item>
      </div>
      <div v-if="$store.getters.hasEntity('districts')">
        <q-list-header class="text-center"><q-icon name="zoom_out_map"></q-icon> District</q-list-header>
        <q-item to="/circuits">
          <q-item-side icon="my_location" />
          <q-item-main label="Circuits" sublabel="view all circuits" />
        </q-item>
      </div>
      <q-list-header class="text-center"><q-icon name="language"></q-icon> Administration</q-list-header>
      <q-item to="/settings">
        <q-item-side icon="settings" />
        <q-item-main label="Settings" sublabel="user settings" />
      </q-item>
      <q-item v-if="$store.state.user.level === 'admin'" to="/users">
        <q-item-side icon="person_add" />
        <q-item-main label="Users" sublabel="user permissions" />
      </q-item>
    </q-layout-drawer>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: false
    }
  },
  mounted () {
    if (localStorage.getItem('CHURCHNET_Version')) {
      if (localStorage.getItem('CHURCHNET_Version') === process.env.VERSION) {
        console.log('Current version')
      } else {
        localStorage.setItem('CHURCHNET_Version', process.env.VERSION)
        window.location.reload()
      }
    } else {
      localStorage.setItem('CHURCHNET_Version', process.env.VERSION)
    }
    if (localStorage.getItem('CHURCHNET_Token')) {
      this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/users/' + localStorage.getItem('CHURCHNET_user_id'))
        .then((response) => {
          this.$store.commit('setUser', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('CHURCHNET_Token')
      this.$router.push({ name: 'login' })
    },
    refresher () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style>
.q-item {
  padding-top:3px;
  padding-bottom: 3px;
}
</style>
