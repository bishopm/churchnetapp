<template>
  <div v-if="circuit" class="q-ma-md">
    <h4 class="text-center">{{circuit.circuitnumber}} {{circuit.circuit}}</h4>
    <p class="q-mx-md caption">Users
      <q-btn class="q-ma-md" @click="addUser" color="primary">Add a user</q-btn>
    </p>
    <ul>
      <li v-for="user in circuit.users" :key="user.id">{{user.name}}</li>
    </ul>
    <p class="q-mx-md caption">Societies</p>
    <ul>
      <li v-for="society in circuit.societies" :key="society.id">{{society.society}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      circuit: {},
      perm: ''
    }
  },
  methods: {
    editCircuit () {
      console.log('editing')
    },
    addUser () {
      this.$router.push({ name: 'userform', params: { user: { sex: 'male', title: 'Mr' }, action: 'add' } })
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/circuits/' + this.$route.params.id)
      .then((response) => {
        this.circuit = response.data
        this.$store.commit('setSelect', this.circuit.id)
        this.perm = this.$store.state.user.circuits[this.society.circuit_id]
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
</style>
