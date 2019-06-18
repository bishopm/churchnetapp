<template>
<q-select outlined v-model="district" @input="updateme" class="q-my-md" label="District" :options="districtOptions"  map-options emit-value/>
</template>

<script>
export default {
  data () {
    return {
      district: '',
      districtOptions: []
    }
  },
  props: ['showme', 'perms'],
  mounted () {
    for (var ckey in this.$store.state.user.districts.full) {
      if (this.perms.includes(this.$store.state.user.districts.full[ckey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.districts.full[ckey].district,
          value: this.$store.state.user.districts.full[ckey].id
        }
        this.districtOptions.push(newitem)
      }
    }
    this.district = newitem.value
    this.$store.commit('setSelect', this.district)
  },
  methods: {
    updateme () {
      this.$store.commit('setSelect', this.district)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
