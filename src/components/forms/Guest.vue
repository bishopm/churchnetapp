<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} GUEST
    </div>
    <div v-if="$route.params.action === 'add'">
      <circuitselect v-if="$route.params.action === 'add'" class="q-ma-md" :perms="['editor','admin']" showme="1"></circuitselect>
      <div class="card q-ma-xs bg-lightgrey">
        <q-search v-if="$route.params.action === 'add'" ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="find the preacher or minister's name" />
        <div class="q-ma-md" v-if="individualOptions.length">
          <q-select float-label="Choose an existing person" v-model="individual_id" :options="individualOptions"/>
        </div>
      </div>
    </div>
    <div v-else class="text-center q-my-md caption">
      {{person.title}} {{person.firstname}} {{person.surname}}
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import circuitselect from './../Circuitselect'
export default {
  data () {
    return {
      search: '',
      circuits: [],
      showdropdown: false,
      individualOptions: [],
      individual_id: null
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  methods: {
    submit () {
      if (this.individual_id) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/guests/add',
          {
            id: this.individual_id,
            circuit: this.$store.state.select,
            active: 'yes'
          })
          .then(response => {
            this.$router.push({ name: 'guests' })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/searchgp',
          {
            search: this.search,
            circuit: this.$store.state.select
          })
          .then(response => {
            this.individualOptions = []
            for (var ikey in response.data) {
              if (response.data[ikey.title]) {
                var newitem1 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem1)
              } else {
                var newitem2 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem2)
              }
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      } else {
        this.individualOptions = []
      }
    }
  },
  mounted () {
    this.circuits.push(this.$store.state.select)
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
  .bg-lightgrey {
    background-color: #eee;
    padding-top:10px;
    padding-bottom:10px;
  }
</style>
