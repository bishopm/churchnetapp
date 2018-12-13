<template>
  <div class="layout-padding">
    <q-list class="no-border">
      <p class="caption text-center">Circuit leaders</p>
      <q-item class="cursor-pointer" v-if="leaders" v-for="leader in leaders" :key="leader.id" @click.native="editLeader(leader)">
        <q-item-main><b>{{leader.surname}}</b>, {{leader.title}} {{leader.firstname}}</q-item-main>
        <q-item-side>
          <span v-for="tag in leader.tags" :key="tag.id">{{tag.name}} </span>
        </q-item-side>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top-right" :offset="[32, 32]">
      <q-btn round color="primary" @click="addLeader" class="fixed" icon="fas fa-plus"/>
    </q-page-sticky>
    <q-modal minimized v-model="modalopen" content-css="padding: 50px">
      <h4 class="text-center">{{form.action}} circuit leader</h4>
      <p v-if="form.action === 'Edit'" class="caption text-center">{{leadername}}</p>
      <div v-if="form.action === 'Add'" class="card q-ma-xs bg-lightgrey">
        <q-select multiple v-model="form.tags" float-label="Role" :options="tagOptions" />
        <q-search ref="search" @input="searchdb" v-model="search" placeholder="search by name" />
        <div class="q-ma-md" v-if="individualOptions.length">
          <q-select float-label="Choose an existing person" v-model="form.individual_id" :options="individualOptions"/>
        </div>
        <div class="text-center" v-if="search.length > 2">
          <q-btn color="black" @click="modalopen=true" label="Or add a new person"></q-btn>
        </div>
      </div>
      <q-btn class="q-mt-md q-ml-md" color="primary" @click="modalopen = false" label="OK" />
      <q-btn class="q-mt-md q-ml-md" color="black" @click="modalopen = false" label="Cancel" />
    </q-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      leaders: [],
      search: '',
      tagOptions: [],
      individualOptions: [],
      societyOptions: [],
      leadername: '',
      form: {
        individual_id: '',
        action: '',
        tags: []
      },
      modalopen: false
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/leaders/' + this.$route.params.id)
      .then(response => {
        this.leaders = response.data.individuals
        for (var tkey in response.data.tags) {
          var newitem = {
            label: response.data.tags[tkey].name,
            value: response.data.tags[tkey].tag_id
          }
          this.tagOptions.push(newitem)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    addLeader () {
      this.form.individual_id = ''
      this.form.tags = []
      this.leadername = ''
      this.form.action = 'Add'
      this.modalopen = true
    },
    editLeader (leader) {
      this.form.individual_id = leader.id
      this.leadername = leader.title + ' ' + leader.firstname + ' ' + leader.surname
      this.form.tags = []
      for (var tag in leader.tags) {
        this.form.tags.push(leader.tags[tag].tag_id)
      }
      this.form.action = 'Edit'
      this.modalopen = true
    },
    searchdb () {
      if (this.search.length > 2) {
        this.$q.loading.show()
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/individuals/searchnp',
          {
            search: this.search,
            circuit: this.$store.state.select
          })
          .then(response => {
            this.individualOptions = []
            for (var ikey in response.data) {
              if (response.data[ikey.title]) {
                var newitem1 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].title + ' ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem1)
              } else {
                var newitem2 = {
                  label: response.data[ikey].surname + ', ' + response.data[ikey].firstname + ' (' + response.data[ikey].household.society.society + ')',
                  value: response.data[ikey].id
                }
                this.individualOptions.push(newitem2)
              }
            }
            if (this.individualOptions.length) {
              this.form.individual_id = this.individualOptions[0].value
            }
            this.$q.loading.hide()
          })
          .catch(function (error) {
            console.log(error)
            this.$q.loading.hide()
          })
      } else {
        this.individualOptions = []
        this.form.individual_id = ''
      }
    }
  }

}
</script>

<style>
</style>
