<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Rosters</p>
      <societyselect @altered="displayrosters" class="q-ma-md" :perms="['edit','admin']" showme="1"></societyselect>
      <q-item v-if="rosters" v-for="roster in rosters" :key="roster.id" @click.native.prevent="showRoster(roster.id)" class="cursor-pointer">
        <q-item-main>{{roster.name}}</q-item-main>
        <q-item-side right>
          <q-btn @click.capture.stop="editRoster(roster.id)" icon="edit"></q-btn>
        </q-item-side>
      </q-item>
    </q-list>
    <div class="text-center">{{emptymessage}}</div>
    <q-btn round color="primary" @click="addRoster" class="fixed" icon="add" style="right: 18px; top: 88px" />
  </div>
</template>

<script>
import societyselect from './Societyselect'
export default {
  data () {
    return {
      rosters: [],
      emptymessage: ''
    }
  },
  computed: {
    month () {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return monthNames[new Date().getMonth()]
    }
  },
  components: {
    'societyselect': societyselect
  },
  methods: {
    addRoster () {
      this.$router.push({name: 'rosterform', params: { action: 'add' }})
    },
    editRoster (id) {
      this.$router.push({name: 'rosterform', params: { action: 'edit', id: id }})
    },
    showRoster (id) {
      this.$router.push({name: 'roster', params: { id: id, year: new Date().getFullYear(), month: this.month }})
    },
    displayrosters () {
      if (this.$store.state.user.societies.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/rosterlist',
          {
            society: this.$store.state.select
          })
          .then(response => {
            this.rosters = response.data
            this.$q.loading.hide()
            if (!this.rosters.length) {
              this.emptymessage = 'No rosters have been set up for this society'
            } else {
              this.emptymessage = ''
            }
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      }
    }
  },
  mounted () {
    this.$q.loading.show()
    this.displayrosters()
  }

}
</script>

<style>
</style>
