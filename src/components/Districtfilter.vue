<template>
<q-select @input="updateme" multiple chips class="q-my-md" v-model="districts" float-label="Districts" :options="districtOptions" />
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
