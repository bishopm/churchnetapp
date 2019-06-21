<template>
  <div class="q-ma-md">
    <p class="caption text-center">Feeds</p>
    <q-list v-if="hasfeeds" no-border>
      <q-item v-for="feed in feeds" :key="feed.feedpost.id" :to="'/feed/edit/' + feed.feedpost.id">
        <q-item-section>{{feed.feedpost.title}}<br><small>{{feed.entity}}: {{feed.feedpost.category}}</small></q-item-section>
        <q-item-section class="text-right"><small>{{feed.feedpost.publicationdate}}</small></q-item-section>
      </q-item>
      <p>{{message}}</p>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn size="sm" round color="primary" @click="addFeed" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      feeds: [],
      message: '',
      hasfeeds: false
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/myfeeditems',
      {
        societies: this.$store.state.user.societies.keys,
        circuits: this.$store.state.user.circuits.keys,
        districts: this.$store.state.user.districts.keys
      })
      .then(response => {
        for (var dkey in response.data) {
          for (var fkey in response.data[dkey]) {
            this.feeds.push(response.data[dkey][fkey])
          }
        }
        if (this.feeds.length) {
          this.hasfeeds = true
        } else {
          this.message = 'No content yet'
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    addFeed () {
      this.$router.push({ name: 'feedform', params: { action: 'add' } })
    }
  }
}
</script>

<style>
</style>
