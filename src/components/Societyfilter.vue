<template>
<q-select v-if="showme > 1" @input="updateMe" multiple chips class="q-my-md" v-model="societies" float-label="Societies" :options="societyOptions" />
</template>

<script>
export default {
  data () {
    return {
      societies: [],
      societyOptions: []
    }
  },
  props: ['showme'],
  mounted () {
    for (var skey in this.$store.state.user.societies) {
      var newitem = {
        label: this.$store.state.user.societies[skey].society,
        value: this.$store.state.user.societies[skey].id.toString()
      }
      this.societies.push(newitem.value)
      this.societyOptions.push(newitem)
    }
    this.$store.commit('setSocieties', this.societies)
  },
  methods: {
    updateMe () {
      this.$store.commit('setSocieties', this.societies)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
