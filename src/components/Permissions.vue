<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      perms: [],
      perm: ''
    }
  },
  mounted () {
    if (this.entity === 'society') {
      this.perms = this.$store.state.user.societies
    } else if (this.entity === 'circuit') {
      this.perms = this.$store.state.user.circuits
    } else if (this.entity === 'district') {
      this.perms = this.$store.state.user.districts
    }
    for (var item in this.perms) {
      if (this.perms[item].id === this.id) {
        this.perm = this.perms[item].pivot.permission
      }
    }
  },
  props: ['entity', 'id']
}
</script>

<style>
</style>
