<template>
<q-select v-if="$store.state.user.circuits.length > 1" @input="updateMe" multiple chips class="q-ma-md" v-model="circuits" float-label="Circuits" :options="circuitOptions" />
</template>

<script>
export default {
  data () {
    return {
      circuits: [],
      circuitOptions: []
    }
  },
  mounted () {
    for (var ckey in this.$store.state.user.circuits) {
      var newitem = {
        label: this.$store.state.user.circuits[ckey].circuit,
        value: this.$store.state.user.circuits[ckey].id.toString()
      }
      this.circuits.push(newitem.value)
      this.circuitOptions.push(newitem)
    }
    this.$store.commit('setCircuits', this.circuits)
  },
  methods: {
    updateMe () {
      this.$store.commit('setCircuits', this.circuits)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
