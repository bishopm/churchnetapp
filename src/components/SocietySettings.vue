<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Society settings</p>
      <q-item v-if="societies" v-for="society in societies" :key="society.id" :to="'/societies/' + society.circuit_id + '_' + society.id">
        {{society.society}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addSociety" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      societies: [],
      search: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter
  },
  methods: {
    addSociety () {
      this.$router.push({name: 'societyform', params: { action: 'add' }})
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    }
  },
  mounted () {
    if (this.$store.state.user.societies.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/societies/settings',
        {
          societies: this.$store.state.user.societies
        })
        .then(response => {
          this.societies = response.data
          this.$q.loading.hide()
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
