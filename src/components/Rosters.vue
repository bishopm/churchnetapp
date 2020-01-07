<template>
  <div class="q-ma-md">
    <q-list v-if="rosters" class="no-border">
      <p class="caption text-center">Rosters</p>
      <societyselect @altered="displayrosters" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
      <q-item v-for="roster in rosters" :key="roster.id" @click.native.prevent="showRoster(roster.id)" class="cursor-pointer">
        <q-item-section>{{roster.name}}</q-item-section>
        <q-item-section align="right" class="cursor-pointer" @click.capture.stop="editRoster(roster.id)">
          <q-icon name="fas fa-edit"></q-icon>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="text-center">{{emptymessage}}</div>
    <q-page-sticky expand position="top-right" :offset="[17, 12]">
      <q-btn size="sm" round color="primary" @click="addRoster" icon="fas fa-plus"/>
    </q-page-sticky>
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
      this.$router.push({ name: 'rosterform', params: { action: 'add' } })
    },
    editRoster (id) {
      this.$router.push({ name: 'rosterform', params: { action: 'edit', id: id } })
    },
    showRoster (id) {
      this.$router.push({ name: 'roster', params: { id: id, year: new Date().getFullYear(), month: this.month } })
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
