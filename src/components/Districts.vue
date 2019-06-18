<template>
  <div class="q-ma-md">
    <q-list v-if="districts" class="no-border">
      <p class="caption text-center">All districts</p>
      <q-input outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="Search by district">
        <template v-slot:append>
          <q-icon name="fa fa-search" />
        </template>
      </q-input>
      <q-item v-for="district in districts" :key="district.id" :to="'/districts/' + district.id">
        {{district.district}}
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn size="sm" round color="primary" @click="addCircuit" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      districts: []
    }
  },
  methods: {
    addCircuit () {
      this.$router.push({name: 'districtform', params: { action: 'add' }})
    }
  },
  mounted () {
    if (this.$store.state.user.circuits.keys) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/districts',
        {
          search: this.search,
          districts: this.$store.state.districtfilter
        })
        .then(response => {
          this.circuits = response.data
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
