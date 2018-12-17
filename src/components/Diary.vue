<template>
  <div>
    <q-list class="no-border">
      <p class="q-mt-md caption text-center">{{$route.params.scope.charAt(0).toUpperCase() + $route.params.scope.slice(1)}} Diary</p>
      <circuitselect class="q-mx-md" @altered="searchdb" :perms="['edit','admin']" showme="1"></circuitselect>
      <q-item v-if="meetings" v-for="meeting in meetings" :key="meeting.id" :to="'/meeting/' + meeting.circuit_id + '/edit/' + meeting.id">
        <q-item-main>{{meeting.description}}&nbsp;<small>({{meeting.society.society}})</small></q-item-main>
        <q-item-side>
          <small>{{formatme(meeting.meetingdatetime)}}</small>
        </q-item-side>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addMeeting" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
export default {
  data () {
    return {
      meetings: [],
      search: ''
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    addMeeting () {
      this.$router.push({name: 'diaryform', params: { action: 'add', entity: this.$store.state.select }})
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    formatme (datein) {
      var fin = new Date(datein * 1000).toISOString()
      return fin.substring(0, 10) + ' [' + fin.substring(11, 16) + ']'
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/meetings/search',
        {
          circuit: this.$store.state.select
        })
        .then(response => {
          this.meetings = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
  }
}
</script>

<style>
</style>
