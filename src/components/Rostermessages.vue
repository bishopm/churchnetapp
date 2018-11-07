<template>
  <div class="layout-padding">
    <q-list v-if="messages">
      <p class="caption text-center">{{roster.name}} <small>{{roster.date}}</small></p>
      <q-item v-for="message in messages" :key="message.cellphone">
        <q-item-main><small>{{message.text}}</small></q-item-main>
        <q-item-side class="text-right"><small>{{message.person.firstname}} {{message.person.surname}}<br>{{message.person.cellphone}}</small></q-item-side>
      </q-item>
      <div class="text-center"><q-btn>Go!</q-btn></div>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: []
    }
  },
  mounted () {
    this.$q.loading.show()
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rostermessages/' + this.$route.params.id)
        .then(response => {
          this.messages = response.data.texts
          this.roster = response.data.roster
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
