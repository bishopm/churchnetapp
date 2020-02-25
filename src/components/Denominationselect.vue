<template>
<q-select outlined v-model="denomination" @input="updateme" class="q-my-md" label="Denomination" :options="denominationOptions"  map-options emit-value/>
</template>

<script>
export default {
  data () {
    return {
      denomination: '',
      denominationOptions: []
    }
  },
  props: ['showme', 'perms', 'initial'],
  mounted () {
    for (var ckey in this.$store.state.user.denominations.full) {
      if (this.perms.includes(this.$store.state.user.denominations.full[ckey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.denominations.full[ckey].denomination,
          value: this.$store.state.user.denominations.full[ckey].id
        }
        if (this.initial !== 'all') {
          this.denomination = this.$store.state.denominationfilter
        }
        this.denominationOptions.push(newitem)
      }
    }
    this.denomination = newitem.value
    this.$store.commit('setSelect', this.denomination)
  },
  methods: {
    updateme () {
      this.$store.commit('setSelect', this.denomination)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
