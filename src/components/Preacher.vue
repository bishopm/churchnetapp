<template>
  <div v-if="preacher.individual" class="text-center layout-padding">
    <p class="caption">{{preacher.individual.title}} {{preacher.individual.firstname}} {{preacher.individual.surname}}
      <q-icon v-if="perm === 'edit'" class="cursor-pointer" @click.native="editPreacher()" name="edit"></q-icon>
    </p>
    <p v-if="preacher.status !== 'minister'">{{preacher.individual.household.society.society}} Society</p>
    {{preacher.individual.cellphone}}
    <p class="q-mt-md">
      <q-chip class="q-mr-md" color="secondary" v-for="tag in preacher.tags" :key="tag.id">{{tag.name}}</q-chip>
    </p>
    <p v-if="preacher.status === 'preacher'">Full plan: {{preacher.fullplan || 'on trial'}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      preacher: {},
      perm: ''
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/people/' + this.$route.params.id)
      .then((response) => {
        this.preacher = response.data
        this.perm = this.$store.state.user.circuits[this.preacher.individual.household.society.circuit_id]
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    editPreacher (id) {
      this.$router.push({name: 'preacherform', params: { preacher: JSON.stringify(this.preacher), action: 'edit' }})
    }
  }
}
</script>

<style>
</style>
