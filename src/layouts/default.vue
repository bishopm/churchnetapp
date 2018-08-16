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
          <q-item to="/people">
            <q-item-side icon="person" />
            <q-item-main label="Preachers" sublabel="preachers and circuit leaders" />
          </q-item>
          <q-item to="/plan">
            <q-item-side icon="mic" />
            <q-item-main label="Plan" sublabel="preaching plan" />
          </q-item>
          <q-item to="/societies">
            <q-item-side icon="room" />
            <q-item-main label="Societies" sublabel="view all societies" />
          </q-item>
        </div>
        <q-item to="/settings">
          <q-item-side icon="settings" />
          <q-item-main label="Settings" sublabel="user settings" />
        </q-item>
        <q-list-header class="text-center"><q-icon name="language"></q-icon> Publish content</q-list-header>
        <q-item to="/publish">
          <q-item-side icon="publish" />
          <q-item-main label="Publish content" sublabel="publish to feed" />
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
    if (localStorage.getItem('CHURCHNET_Token')) {
      this.$store.commit('setToken', localStorage.getItem('CHURCHNET_Token'))
    } else {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
</style>
