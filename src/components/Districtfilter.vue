<template>
<q-select outlined @input="updateme" multiple use-chips class="q-my-md" v-model="districts" label="Synods" :options="districtOptions"  map-options emit-value/>
</template>

<script>
export default {
  data () {
    return {
      districts: [],
      districtOptions: []
    }
  },
  props: ['showme'],
  mounted () {
    for (var dkey in this.$store.state.user.districts.full) {
      var newitem = {
        label: this.$store.state.user.districts.full[dkey].district,
        value: this.$store.state.user.districts.full[dkey].id.toString()
      }
      this.districts.push(newitem.value)
      this.districtOptions.push(newitem)
    }
    this.$store.commit('setDFilter', this.districts)
  },
  methods: {
    updateme () {
      this.$store.commit('setDFilter', this.districts)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
