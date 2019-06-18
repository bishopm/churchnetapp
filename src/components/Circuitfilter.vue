<template>
<q-select outlined @input="updateme" multiple use-chips class="q-my-md" v-model="circuits" label="Circuits" :options="circuitOptions"  map-options emit-value/>
</template>

<script>
export default {
  data () {
    return {
      circuits: [],
      circuitOptions: []
    }
  },
  props: ['showme', 'initial'],
  mounted () {
    for (var ckey in this.$store.state.user.circuits.full) {
      var newitem = {
        label: this.$store.state.user.circuits.full[ckey].circuit,
        value: this.$store.state.user.circuits.full[ckey].id.toString()
      }
      this.circuitOptions.push(newitem)
      if (this.initial === 'all') {
        this.circuits.push(newitem.value)
      }
    }
    if (this.initial !== 'all') {
      this.circuits = this.$store.state.circuitfilter
    }
    this.$store.commit('setCFilter', this.circuits)
  },
  methods: {
    updateme () {
      this.$store.commit('setCFilter', this.circuits)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
