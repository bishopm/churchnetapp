<template>
<q-select v-model="society" @input="updateme" class="q-my-md" float-label="Society" :options="societyOptions" />
</template>

<script>
export default {
  data () {
    return {
      society: '',
      societyOptions: []
    }
  },
  props: ['showme', 'perms'],
  mounted () {
    for (var skey in this.$store.state.user.societies.full) {
      if (this.perms.includes(this.$store.state.user.societies.full[skey].pivot.permission)) {
        var newitem = {
          label: this.$store.state.user.societies.full[skey].society,
          value: this.$store.state.user.societies.full[skey].id
        }
        this.societyOptions.push(newitem)
      }
    }
    this.society = this.societyOptions[0].value
    this.$store.commit('setSelect', this.society)
  },
  methods: {
    updateme () {
      this.$store.commit('setSelect', this.society)
      this.$emit('altered')
    }
  }
}
</script>

<style>
</style>
