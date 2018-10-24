<template>
  <div>
    <q-list class="no-border">
      <p class="q-mt-md caption text-center">Circuit meetings</p>
      <circuitselect class="q-mx-md" @altered="searchdb" :perms="['edit','admin']" showme="1"></circuitselect>
      <q-item v-if="meetings" v-for="meeting in meetings" :key="meeting.id" :to="'/meetings/' + meeting.id">
        <q-item-main>{{meeting.description}}&nbsp;<small>({{meeting.society.society}})</small></q-item-main>
        <q-item-side>
          <small>{{formatme(meeting.meetingdatetime)}}</small>
        </q-item-side>
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addMeeting" class="fixed" icon="add" style="right: 4px; top: 72px" />
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
      this.$router.push({name: 'meetingform', params: { action: 'add', circuit: this.$store.state.select }})
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
