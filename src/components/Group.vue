<template>
  <div>
    <div v-if="group" class="text-center layout-padding">
      <p class="caption"><b>{{group.groupname}}</b><small class="q-mx-sm" v-if="soc">{{soc.society}}</small>
        <q-icon v-if="edit" class="cursor-pointer" @click.native="editGroup" name="fas fa-edit"></q-icon>
      </p>
      <form name="reportform" method="post" :action="url" target="_blank">
        <q-btn v-if="members.length" color="secondary" type="submit" target="_blank">View report</q-btn>
        <input type="hidden" name="members" :value="jmembers">
        <input type="hidden" name="group" :value="JSON.stringify(group)">
      </form>
      <q-search v-if="!blocked" ref="search" class="q-ma-md" @input="searchdb" v-model="search" placeholder="search by name to add a group member" />
      <div class="q-ma-md" v-if="search.length > 2">
        <q-select @input="addIndiv()" float-label="Individual" v-model="individual_id" :options="individualOptions"/>
      </div>
      <q-item v-for="individual in members" :key="individual.id">
        <q-item-main>{{individual.firstname}} {{individual.surname}}</q-item-main>
        <q-item-side align="right" color="black" icon="fas fa-times" class="cursor-pointer" @click.native="removeIndiv(individual.id)"></q-item-side>
      </q-item>
    </div>
    <p class="q-ma-lg text-center caption">{{blocked}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      group: {},
      members: [],
      individual_id: '',
      individualOptions: [],
      search: '',
      blocked: '',
      url: process.env.WEB + '/groupreport'
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/groups/' + this.$route.params.id)
      .then((response) => {
        if (response.data === 'Unauthorised') {
          this.blocked = 'Sorry - you are not authorised to view this group'
        } else {
          this.members = response.data.members
          this.group = response.data.group
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  computed: {
    edit () {
      if (this.$store.state.user.societies) {
        if ((this.$store.state.user.societies[this.group.society_id] === 'edit') || (this.$store.state.user.societies[this.group.society_id] === 'admin')) {
          return true
        }
      }
    },
    jmembers () {
      return JSON.stringify(this.members)
    },
    soc () {
      return this.$store.state.user.societies.full[this.group.society_id]
    }
  },
  methods: {
    editGroup () {
      this.$router.push({name: 'groupform', params: { action: 'edit', id: this.$route.params.id }})
    },
    showReport () {
      this.reportform.submit()
    },
    removeIndiv (id) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/groups/' + this.group.id + '/remove',
        {
          id: id
        })
        .then(response => {
          for (var mndx in this.members) {
            if (this.members[mndx].id === id) {
              this.members.splice(mndx, 1)
              break
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    addIndiv () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/groups/' + this.group.id + '/add',
        {
          id: this.individual_id
        })
        .then(response => {
          this.members.push(response.data)
          this.search = ''
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/search',
          {
            search: this.search,
            society: this.group.society_id
          })
          .then(response => {
            this.individualOptions = []
            for (var ikey in response.data) {
              var newitem = {
                label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                value: response.data[ikey].id
              }
              this.individualOptions.push(newitem)
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      } else {
        this.individualOptions = []
        this.group.individual_id = ''
      }
    }
  }
}
</script>

<style>
</style>
