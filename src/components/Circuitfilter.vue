<template>
<q-select v-if="showme > 1" @input="updateMe" multiple chips class="q-my-md" v-model="circuits" float-label="Circuits" :options="circuitOptions" />
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
      this.circuits.push(newitem.value)
      this.circuitOptions.push(newitem)
    }
  }
}
</script>

<style>
</style>
