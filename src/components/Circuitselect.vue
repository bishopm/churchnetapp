<template>
<q-select v-if="showme > 1" @input="updateMe" class="q-my-md" v-model="circuits" float-label="Circuits" :options="circuitOptions" />
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
  },
  methods: {
    updateMe () {
      this.$parent.emit('setcircuit', this.circuits)
    }
  }
}
</script>

<style>
</style>
