<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-black text-white" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
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
    </q-header>
    <q-drawer side="left" v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <div v-if="$store.getters.hasEntity('societies')">
          <q-item-label class="text-center bg-primary text-white q-py-md">
            Members
          </q-item-label>
          <q-item to="/households">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-user-friends" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Individuals</q-item-label>
              <q-item-label caption>search for individuals</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/groups">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-users" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Groups</q-item-label>
              <q-item-label caption>view all groups</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/communicate">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-comments" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Communication</q-item-label>
              <q-item-label caption>send emails or messages</q-item-label>
            </q-item-section>
          </q-item>
          <q-item-label class="text-center bg-secondary text-white q-py-md">
            Society admin
          </q-item-label>
          <q-item to="/bulletin">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-newspaper" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Bulletin</q-item-label>
              <q-item-label caption>set up Sunday Bulletins</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/diary/society">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-calendar" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Diary</q-item-label>
              <q-item-label caption>add or edit society events</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="givingadmin" to="/giving">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-coins" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Giving</q-item-label>
              <q-item-label caption>view giving records</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/feeds">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-book-open" />
          </q-item-section>
          <q-item-section side>
              <q-item-label overline>Published content</q-item-label>
              <q-item-label caption>current & historic feed content</q-item-label>
            </q-item-section>
          </q-item>
          <q-item :to="$store.state.user.societies.keys.length > 1 ? '/readings' : '/readings/' + $store.state.user.societies.keys[0]">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-book" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Readings</q-item-label>
              <q-item-label caption>non-lectionary weekly readings</q-item-label>
            </q-item-section>
          </q-item>
          <q-item :to="$store.state.user.societies.keys.length > 1 ? '/statistics' : '/statistics/' + $store.state.user.societies.keys[0]">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-chart-line" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Reports</q-item-label>
              <q-item-label caption>view statistics and reports</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/rosters">
            <q-item-section avatar>
              <q-icon color="primary" name="fas fa-fw fa-calendar-alt" />
            </q-item-section>
            <q-item-section side>
              <q-item-label overline>Rosters</q-item-label>
              <q-item-label caption>society rosters</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/venues">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-search-location" />
          </q-item-section>
          <q-item-section side>
              <q-item-label overline>Venues</q-item-label>
              <q-item-label caption>venue bookings</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <q-item-label class="text-center bg-black text-white q-py-md">
          Settings
        </q-item-label>
        <q-item v-if="societyadmin" to="/societysettings">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-church" />
          </q-item-section>
          <q-item-section side>
              <q-item-label overline>Society settings</q-item-label>
              <q-item-label caption>admin settings for societies</q-item-label>
            </q-item-section>
        </q-item>
        <q-item clickable @click.native="logout()">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-sign-out-alt" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Log out</q-item-label>
            <q-item-label caption>log out of ChurchNet</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view :key="$route.fullPath"></router-view>
    </q-page-container>
    <q-drawer side="right" v-model="rightDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <div v-if="$store.getters.hasEntity('circuits')">
        <q-item-label class="text-center bg-primary text-white q-py-md">
          Circuit
        </q-item-label>
        <q-item to="/diary/circuit">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-calendar" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Circuit diary</q-item-label>
            <q-item-label caption>add or edit diary entries</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/plan">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-microphone" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Preaching plan</q-item-label>
            <q-item-label caption>set up preachers and plan</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/societies">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-map-marker-alt" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Societies</q-item-label>
            <q-item-label caption>view all societies</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="circuitadmin" to="/circuitsettings">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-users-cog" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Circuit settings</q-item-label>
            <q-item-label caption>view circuit settings</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div v-if="$store.getters.hasEntity('districts')">
        <q-item-label class="text-center bg-secondary text-white q-py-md">
          Synod
        </q-item-label>
        <q-item to="/circuits">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-sitemap" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Circuits</q-item-label>
            <q-item-label caption>view all circuits</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/diary/district">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-calendar" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Synod diary</q-item-label>
            <q-item-label caption>add or edit diary entries</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div v-if="$store.getters.hasEntity('denominations')">
        <q-item-label class="text-center bg-grey text-white q-py-md">
          Church
        </q-item-label>
        <q-item to="/denominationsettings">
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-fw fa-users-cog" />
          </q-item-section>
          <q-item-section side>
            <q-item-label overline>Denomination</q-item-label>
            <q-item-label caption>settings and officials</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <q-item-label class="text-center bg-black text-white q-py-md">
        Administration
      </q-item-label>
      <q-item to="/settings">
        <q-item-section avatar>
          <q-icon color="primary" name="fas fa-fw fa-cogs" />
        </q-item-section>
        <q-item-section side>
          <q-item-label overline>Settings</q-item-label>
          <q-item-label caption>user settings (v{{version}})</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="$store.state.user.level < 5" to="/users">
        <q-item-section avatar>
          <q-icon color="primary" name="fas fa-fw fa-user-cog" />
        </q-item-section>
        <q-item-section side>
          <q-item-label overline>Users</q-item-label>
          <q-item-label caption>user permissions</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      version: localStorage.getItem('CHURCHNET_Version')
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
    this.$store.commit('setAdminoptions', false)
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
          if (response.data === 'Invalid token') {
            this.$q.loading.hide()
            localStorage.removeItem('CHURCHNET_Token')
            this.$q.dialog({
              title: 'Authentication token refresh',
              message: 'Due to a software upgrade or some other issue with your device, your authentication token needs to be refreshed. This shouldn\'t happen very often! The app will now restart. Thank you :)',
              ok: 'OK'
            }).onOk(() => {
              localStorage.setItem('CHURCHNET_Version', response.data.version)
              window.location.reload()
            })
          } else if (localStorage.getItem('CHURCHNET_Version')) {
            this.$q.loading.hide()
            if (localStorage.getItem('CHURCHNET_Version') !== response.data.version) {
              this.$q.dialog({
                title: 'New version available',
                message: 'Click OK to restart the app and upgrade to version ' + response.data.version + '. This new version includes: ' + response.data.updatenotes,
                ok: 'OK',
                cancel: 'LATER'
              }).onOk(() => {
                localStorage.setItem('CHURCHNET_Version', response.data.version)
                window.location.reload()
              }).onCancel(() => {
                console.log('Delaying upgrade')
              })
            }
          } else {
            localStorage.setItem('CHURCHNET_Version', response.data.version)
          }
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
#toolbar {
  display: flex;
  justify-content: space-between;
}
.q-item {
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 20px;
}
</style>
