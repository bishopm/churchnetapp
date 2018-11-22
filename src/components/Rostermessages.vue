<template>
  <div class="layout-padding">
    <q-list v-if="messages.length">
      <p class="caption text-center">{{roster.name}} <small>{{roster.date}}</small></p>
      <q-item v-for="message in messages" :key="message.cellphone">
        <q-item-main>
          <small>
            {{message.text}}
          </small>
        </q-item-main>
        <q-item-side class="text-right"><small>{{message.person.firstname}} {{message.person.surname}}<br>{{message.person.cellphone}}</small></q-item-side>
      </q-item>
      <div class="caption text-center" v-if="extras.length">Extra info
        <q-btn class="q-ma-md" color="primary" @click="modalopen = true">Edit</q-btn>
        <p v-for="extra in extras" :key="extra.id">
          <b>{{extra.name}}:</b> {{extra.txt}}
        </p>
      </div>
      <div class="text-center"><q-btn @click="sendmessages">Send messages</q-btn></div>
    </q-list>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <h4>Extra information needed</h4>
      <p v-for="grp in extras" :key="grp.id">
        <q-input :float-label="grp.name" v-model="grp.txt" />
      </p>
      <q-btn @click="modalopen = false">OK</q-btn>
    </q-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: [],
      roster: {},
      extras: [],
      modalopen: false
    }
  },
  mounted () {
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rostermessages/' + this.$route.params.id)
        .then(response => {
          this.messages = response.data.texts
          this.roster = response.data.roster
          for (var endx in this.roster.extras) {
            var extra = {
              id: endx,
              name: this.roster.extras[endx],
              txt: ''
            }
            this.extras.push(extra)
          }
          if (this.extras.length) {
            this.modalopen = true
          }
          if (!this.messages) {
            this.$q.notify('No messages to preview')
            this.$router.go(-1)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    sendmessages () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/rostermessages/' + this.form.id,
        {
          addressee: this.form.addressee,
          addr1: this.form.addr1,
          addr2: this.form.addr2,
          addr3: this.form.addr3,
          homephone: this.form.homephone,
          householdcell: this.form.householdcell,
          latitude: this.form.latitude,
          longitude: this.form.longitude
        })
        .then(response => {
          this.$q.loading.hide()
          this.$q.notify('Household updated')
          this.$router.push({ name: 'household', params: { id: response.data.id } })
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  }
}
</script>

<style>
</style>
