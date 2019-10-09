<template>
  <div>
    <q-list v-if="meetings" class="no-border">
      <p class="q-mt-md caption text-center">
        {{$route.params.scope.charAt(0).toUpperCase() + $route.params.scope.slice(1)}} Diary
      </p>
      <societyselect v-if="$route.params.scope==='society'" class="q-mx-md" @altered="searchdb" :perms="['editor','admin']" showme="1"></societyselect>
      <circuitselect v-if="$route.params.scope==='circuit'" class="q-mx-md" @altered="searchdb" :perms="['editor','admin']" showme="1"></circuitselect>
      <districtselect v-if="$route.params.scope==='district'" class="q-mx-md" @altered="searchdb" :perms="['editor','admin']" showme="1"></districtselect>
      <q-item class="q-mx-sm" v-for="meeting in meetings" :key="meeting.id" :to="'/meeting/' + $route.params.scope + '/edit/' + entity.id + '/' + meeting.id">
        <q-item-section>{{meeting.description}}&nbsp;<small v-if="meeting.society">({{meeting.society.society}})</small></q-item-section>
        <q-item-section>
          <small>{{formatme(meeting.meetingdatetime)}}</small>
        </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round size="sm" color="primary" @click="addMeeting" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
import districtselect from './Districtselect'
import societyselect from './Societyselect'
export default {
  data () {
    return {
      entity: {},
      meetings: [],
      search: ''
    }
  },
  components: {
    'circuitselect': circuitselect,
    'districtselect': districtselect,
    'societyselect': societyselect
  },
  methods: {
    addMeeting () {
      this.$router.push({ name: 'diaryform', params: { action: 'add', scope: this.$route.params.scope, entity: JSON.stringify(this.entity) } })
    },
    formatme (datein) {
      var fin = new Date(datein * 1000)
      return fin.toUTCString().substring(4, 22)
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/meetings/search',
        {
          scope: this.$route.params.scope,
          id: this.$store.state.select
        })
        .then(response => {
          this.meetings = response.data.meetings
          this.entity = response.data.entity
        })
        .catch(function (error) {
          console.log(error)
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
