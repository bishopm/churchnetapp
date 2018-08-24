<template>
<q-select v-model="circuit" class="q-my-md" float-label="Circuits" :options="circuitOptions" />
</template>

<script>
export default {
  data () {
    return {
      circuit: '',
      circuitOptions: []
    }
  },
  props: ['showme', 'perms'],
  mounted () {
    for (var ckey in this.$store.state.user.circuits.full) {
      if (this.perms.includes(this.$store.state.user.circuits.full[ckey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.circuits.full[ckey].circuit,
          value: this.$store.state.user.circuits.full[ckey].id
        }
        this.circuitOptions.push(newitem)
      }
    }
    this.circuit = newitem.value
  }
}
</script>

<style>
</style>
