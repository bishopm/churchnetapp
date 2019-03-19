<template>
<q-select v-model="circuit" @input="updateme" class="q-my-md" float-label="Circuit" :options="circuitOptions" />
</template>

<script>
export default {
  data () {
    return {
      circuit: '',
      circuitOptions: []
    }
  },
  props: ['showme', 'perms', 'initial'],
  mounted () {
    for (var ckey in this.$store.state.user.circuits.full) {
      if (this.perms.includes(this.$store.state.user.circuits.full[ckey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.circuits.full[ckey].circuit,
          value: this.$store.state.user.circuits.full[ckey].id
        }
        if (this.initial !== 'all') {
          this.circuit = this.$store.state.circuitfilter
        }
        this.circuitOptions.push(newitem)
      }
    }
    this.circuit = newitem.value
    this.$store.commit('setSelect', this.circuit)
  },
  methods: {
    updateme () {
      this.$store.commit('setSelect', this.circuit)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
