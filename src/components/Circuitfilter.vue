<template>
<q-select @input="updateme" multiple chips class="q-my-md" v-model="circuits" float-label="Circuits" :options="circuitOptions" />
</template>

<script>
export default {
  data () {
    return {
      circuits: [],
      circuitOptions: []
    }
  },
  props: ['showme'],
  mounted () {
    for (var ckey in this.$store.state.user.circuits.full) {
      var newitem = {
        label: this.$store.state.user.circuits.full[ckey].circuit,
        value: this.$store.state.user.circuits.full[ckey].id.toString()
      }
      this.circuitOptions.push(newitem)
    }
    this.circuits = this.$store.state.circuitfilter
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
