<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="fas fa-user" />
        </q-btn>
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration:none;">ChurchNet</router-link>
        </q-toolbar-title>
        <q-btn flat dense round v-if="$store.getters.hasEntity('circuits')" @click="rightDrawerOpen = !rightDrawerOpen" aria-label="Menu">
          <q-icon name="fas fa-church" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer side="left" v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <div v-if="$store.getters.hasEntity('societies')">
          <q-list-header class="text-center"><q-icon name="fas fa-user"></q-icon> Members</q-list-header>
          <q-item to="/households">
            <q-item-side icon="fas fa-fw fa-user-friends" />
            <q-item-main label="Households" sublabel="view all households" />
          </q-item>
          <q-item to="/groups">
            <q-item-side icon="fas fa-fw fa-users" />
            <q-item-main label="Groups" sublabel="view all groups" />
          </q-item>
          <q-item to="/communicate">
            <q-item-side icon="fas fa-fw fa-comments" />
            <q-item-main label="Communication" sublabel="send emails or messages" />
          </q-item>
          <q-list-header class="text-center"><q-icon name="fas fa-toolbox"></q-icon> Society admin</q-list-header>
          <q-item to="/bulletin">
            <q-item-side icon="fas fa-fw fa-newspaper" />
            <q-item-main label="Bulletin" sublabel="set up Sunday Bulletins" />
          </q-item>
          <q-item to="/diary/society">
            <q-item-side icon="fas fa-fw fa-calendar" />
            <q-item-main label="Diary" sublabel="add or edit society events" />
          </q-item>
          <q-item v-if="givingadmin" to="/giving">
            <q-item-side icon="fas fa-fw fa-coins" />
            <q-item-main label="Giving" sublabel="view giving records" />
          </q-item>
          <q-item to="/rosters">
            <q-item-side icon="fas fa-fw fa-calendar-alt" />
            <q-item-main label="Rosters" sublabel="society rosters" />
          </q-item>
          <q-item to="/statistics">
            <q-item-side icon="fas fa-fw fa-chart-line" />
            <q-item-main label="Statistics" sublabel="view worship service statistics" />
          </q-item>
        </div>
        <q-item to="/feeds">
          <q-item-side icon="fas fa-fw fa-book-open" />
          <q-item-main label="Published content" sublabel="current & historic feed content" />
        </q-item>
        <q-list-header class="text-center"><q-icon name="fas fa-cogs"></q-icon> Settings</q-list-header>
        <q-item v-if="societyadmin" to="/societysettings">
          <q-item-side icon="fas fa-fw fa-church" />
          <q-item-main label="Society settings" sublabel="admin settings for societies" />
        </q-item>
        <q-item @click.native="logout()">
          <q-item-side icon="fas fa-fw fa-sign-out-alt" />
          <q-item-main label="Log out" sublabel="log out of ChurchNet" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view :key="$route.fullPath"></router-view>
    </q-page-container>
    <q-layout-drawer side="right" v-model="rightDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <div v-if="$store.getters.hasEntity('circuits')">
        <q-list-header class="text-center"><q-icon name="fas fa-users"></q-icon> Circuit</q-list-header>
        <q-item to="/diary/circuit">
          <q-item-side icon="fas fa-fw fa-calendar" />
          <q-item-main label="Circuit diary" sublabel="add or edit diary entries" />
        </q-item>
        <q-item to="/plan">
          <q-item-side icon="fas fa-fw fa-microphone" />
          <q-item-main label="Preaching plan" sublabel="set up preachers and plan" />
        </q-item>
        <q-item to="/societies">
          <q-item-side icon="fas fa-fw fa-map-marker-alt" />
          <q-item-main label="Societies" sublabel="view all societies" />
        </q-item>
        <q-item v-if="circuitadmin" to="/circuitsettings">
          <q-item-side icon="fas fa-fw fa-users-cog" />
          <q-item-main label="Circuit settings" sublabel="view circuit settings" />
        </q-item>
      </div>
      <div v-if="$store.getters.hasEntity('districts')">
        <q-list-header class="text-center"><q-icon name="fas fa-globe-africa"></q-icon> District</q-list-header>
        <q-item to="/circuits">
          <q-item-side icon="fas fa-fw fa-sitemap" />
          <q-item-main label="Circuits" sublabel="view all circuits" />
        </q-item>
        <q-item to="/diary/district">
          <q-item-side icon="fas fa-fw fa-calendar" />
          <q-item-main label="District diary" sublabel="add or edit diary entries" />
        </q-item>
      </div>
      <q-list-header class="text-center"><q-icon name="fas fa-toolbox"></q-icon> Administration</q-list-header>
      <q-item to="/settings">
        <q-item-side icon="fas fa-fw fa-cogs" />
        <q-item-main label="Settings" :sublabel="'user settings (v' + version + ')'" />
      </q-item>
      <q-item v-if="$store.state.user.level < 5" to="/users">
        <q-item-side icon="fas fa-fw fa-user-cog" />
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
      rightDrawerOpen: this.$q.platform.is.desktop,
      version: process.env.VERSION
    }
  },
  computed: {
    societyadmin () {
      for (var sa in this.$store.state.user.societies) {
        if (this.$store.state.user.societies[sa] === 'admin') {
          return true
        }
      }
      return false
    },
    circuitadmin () {
      for (var ca in this.$store.state.user.circuits) {
        if (this.$store.state.user.circuits[ca] === 'admin') {
          return true
        }
      }
      return false
    },
    givingadmin () {
      for (var ga in this.$store.state.user.societies.full) {
        if (this.$store.state.user.societies.full[ga].giving_user === this.$store.state.user.id) {
          return true
        }
      }
      return false
    }
  },
  mounted () {
    if (localStorage.getItem('CHURCHNET_Version')) {
      if (localStorage.getItem('CHURCHNET_Version') !== process.env.VERSION) {
        this.$q.dialog({
          title: 'New version available',
          message: 'Click OK to restart the app and upgrade to version ' + process.env.VERSION + '. This new version includes: ' + process.env.VNOTES,
          ok: 'OK',
          cancel: 'LATER'
        }).then(() => {
          localStorage.setItem('CHURCHNET_Version', process.env.VERSION)
          window.location.reload()
        }).catch(() => {
          console.log('Delaying upgrade')
        })
      }
    } else {
      localStorage.setItem('CHURCHNET_Version', process.env.VERSION)
    }
    if (localStorage.getItem('CHURCHNET_Token')) {
      this.$q.loading.show({
        message: 'Welcome! Logging you in...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white'
      })
      this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/users/' + localStorage.getItem('CHURCHNET_user_id'))
        .then((response) => {
          this.$store.commit('setUser', response.data)
          this.$store.commit('setLoaded', true)
          this.$q.loading.hide()
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
