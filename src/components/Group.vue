<template>
  <div v-if="group" class="text-center layout-padding">
    <p class="caption">{{group.groupname}} <q-icon v-if="edit" class="cursor-pointer" @click.native="editGroup" name="edit"></q-icon></p>
    <q-item v-for="individual in group.individuals" :key="individual.id" :to="'/households/' + individual.household_id">
      {{individual.firstname}} {{individual.surname}}
    </q-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      group: {}
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/groups/' + this.$route.params.id)
      .then((response) => {
        this.group = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  computed: {
    edit () {
      if ((this.$store.state.user.societies.edit) && (this.$store.state.user.societies.edit.contains(this.group.society_id))) {
        return true
      }
    }
  },
  methods: {
    editGroup () {
      this.$router.push({name: 'editgroup'})
    }
  }
}
</script>

<style>
</style>
