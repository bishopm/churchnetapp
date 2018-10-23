<template>
  <div>
    <q-list class="no-border">
      <circuitfilter class="q-mx-md" @altered="searchdb" :showme="showme()"></circuitfilter>
      <q-item v-if="meetings" v-for="meeting in meetings" :key="meeting.id" :to="'/meetings/' + meeting.id">
        {{meeting}}
      </q-item>
    </q-list>
    <q-btn round color="positive" @click="addMeeting" class="fixed" icon="add" style="right: 4px; top: 72px" />
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      meetings: [],
      search: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    addMeeting () {
      this.$router.push({name: 'meetingform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.circuits.keys.length
    },
    searchdb () {
      if (this.$store.state.user.circuits.keys) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/meetings/search',
          {
            circuits: this.$store.state.circuitfilter
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
    }
  }
}
</script>

<style>
</style>
