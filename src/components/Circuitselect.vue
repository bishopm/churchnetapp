<template>
<q-select @input="$emit('setcircuit', circuits)" class="q-my-md" v-model="circuits" float-label="Circuits" :options="circuitOptions" />
</template>

<script>
export default {
  data () {
    return {
      circuits: [],
      circuitOptions: []
    }
  },
  props: ['showme', 'perms'],
  mounted () {
    for (var ckey in this.$store.state.user.circuits) {
      if (this.perms.includes(this.$store.state.user.circuits[ckey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.circuits[ckey].circuit,
          value: this.$store.state.user.circuits[ckey].id.toString()
        }
        this.circuits.push(newitem.value)
        this.circuitOptions.push(newitem)
      }
    }
  }
}
</script>

<style>
</style>
