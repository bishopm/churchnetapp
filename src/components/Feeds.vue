<template>
  <div class="layout-padding">
    <p class="caption text-center">Feeds</p>
    <q-list no-border>
      <q-item v-for="feed in feeds" :key="feed.id" :to="'/feed/edit/' + feed.feedpost.id">
        <q-item-main>{{feed.feedpost.title}}<br><small>{{feed.entity}}: {{feed.feedpost.category}}</small></q-item-main>
        <q-item-side><small>{{feed.feedpost.publicationdate}}</small></q-item-side>
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addFeed" class="fixed" icon="add" style="right: 18px; top: 88px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      feeds: []
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/myfeeditems',
      {
        societies: this.$store.state.user.societies.keys,
        circuits: this.$store.state.user.circuits.keys
      })
      .then(response => {
        this.feeds = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    addFeed () {
      this.$router.push({name: 'feedform', params: { action: 'add' }})
    }
  }
}
</script>

<style>
</style>
