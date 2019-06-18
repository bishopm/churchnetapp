<template>
<q-select outlined v-if="showme > 1" @input="updateme" multiple use-chips class="q-my-md" v-model="societies" label="Societies" :options="societyOptions" map-options emit-value/>
</template>

<script>
export default {
  data () {
    return {
      societies: [],
      societyOptions: []
    }
  },
  props: ['showme', 'initial'],
  mounted () {
    for (var skey in this.$store.state.user.societies.full) {
      var newitem = {
        label: this.$store.state.user.societies.full[skey].society,
        value: this.$store.state.user.societies.full[skey].id.toString()
      }
      this.societyOptions.push(newitem)
      if (this.initial === 'all') {
        this.societies.push(newitem.value)
      }
    }
    if (this.initial !== 'all') {
      this.societies = this.$store.state.societyfilter
    }
    this.$store.commit('setSFilter', this.societies)
  },
  methods: {
    updateme () {
      this.$store.commit('setSFilter', this.societies)
      this.$emit('altered')
    }
  }
}
</script>

<style>
.q-chip {
  background-color: #81be41;
  color:white;
}
</style>
