<template>
  <div v-if="user" class="text-center layout-padding">
    <h3>{{user.name}}</h3>
    <q-btn @click="update" color="primary">Update changes</q-btn>
    <h4><b>Societies</b></h4>
    <div v-if="user.societies">
      <p v-for="society in user.societies.full" :key="society.id">{{society.society}} ({{society.pivot.permission}})
        <q-icon class="cursor-pointer" @click.native="deleteperm(society.pivot)" color="secondary" name="delete"></q-icon>
      </p>
    </div>
    <div class="row justify-center" v-if="$store.state.user.level < 5">
      <q-select class="q-ml-md" multiple float-label="Give society access to this user" v-model="form.societies" :options="societyOptions"/>
      <q-select class="q-mx-md" float-label="Level" v-model="form.societylevel" :options="levelOptions"/>
    </div>
    <h4><b>Circuits</b></h4>
    <div v-if="user.circuits">
      <p v-for="circuit in user.circuits.full" :key="circuit.id">{{circuit.circuit}} ({{circuit.pivot.permission}})
        <q-icon class="cursor-pointer" @click.native="deleteperm(circuit.pivot)" color="secondary" name="delete"></q-icon>
      </p>
    </div>
    <div class="row justify-center" v-if="$store.state.user.level < 4">
      <q-select class="q-ml-md" multiple float-label="Give circuit access to this user" v-model="form.circuits" :options="circuitOptions"/>
      <q-select class="q-mx-md" float-label="Level" v-model="form.circuitlevel" :options="levelOptions"/>
    </div>
    <h4><b>Districts</b></h4>
    <div v-if="user.districts">
      <p v-for="district in user.districts.full" :key="district.id">{{district.district}} ({{district.pivot.permission}})
        <q-icon class="cursor-pointer" @click.native="deleteperm(district.pivot)" color="secondary" name="delete"></q-icon>
      </p>
    </div>
    <div class="row justify-center" v-if="$store.state.user.level < 3">
      <q-select class="q-ml-md" multiple float-label="Give district access to this user" v-model="form.districts" :options="districtOptions"/>
      <q-select class="q-mx-md" float-label="Level" v-model="form.districtlevel" :options="levelOptions"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      form: {
        districts: [],
        circuits: [],
        societies: [],
        districtlevel: 'editor',
        circuitlevel: 'editor',
        societylevel: 'editor'
      },
      societyOptions: [],
      circuitOptions: [],
      districtOptions: [],
      levelOptions: [{label: 'admin', value: 'admin'}, {label: 'editor', value: 'editor'}]
    }
  },
  methods: {
    update () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
      this.$axios.post(process.env.API + '/permissibles',
        {
          form: this.form,
          user_id: this.user.id
        })
        .then(response => {
          this.$q.notify('User permissions have been updated')
          this.$router.go(-1)
        })
        .catch(function (error) {
          this.error = error
        })
    },
    deleteperm (perm) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
      this.$axios.post(process.env.API + '/permissibles/delete',
        {
          perms: perm
        })
        .then(response => {
          this.$q.notify('User permission has been deleted')
          this.$router.go(-1)
        })
        .catch(function (error) {
          this.error = error
        })
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/users/' + this.$route.params.id + '/' + this.$store.state.user.id)
      .then((response) => {
        this.user = response.data
        this.societyOptions = []
        for (var skey in response.data.auth.societies) {
          if ((!this.user.societies) || (this.user.societies.keys.indexOf(response.data.auth.societies[skey].id) === -1)) {
            var newitem = {
              label: response.data.auth.societies[skey].society,
              value: response.data.auth.societies[skey].id
            }
            this.societyOptions.push(newitem)
          }
        }
        this.circuitOptions = []
        for (var ckey in response.data.auth.circuits) {
          if ((!this.user.circuits) || (this.user.circuits.keys.indexOf(response.data.auth.circuits[ckey].id) === -1)) {
            var cnewitem = {
              label: response.data.auth.circuits[ckey].circuitnumber + ' ' + response.data.auth.circuits[ckey].circuit,
              value: response.data.auth.circuits[ckey].id
            }
            this.circuitOptions.push(cnewitem)
          }
        }
        this.districtOptions = []
        for (var dkey in response.data.auth.districts) {
          if ((!this.user.districts) || (this.user.districts.keys.indexOf(response.data.auth.districts[dkey].id) === -1)) {
            var dnewitem = {
              label: response.data.auth.districts[dkey].district,
              value: response.data.auth.districts[dkey].id
            }
            this.districtOptions.push(dnewitem)
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
  p {
    margin-bottom: 0px;
  }
  h3 {
    margin-bottom: 2px;
  }
  h4 {
    margin-bottom: 2px;
  }
</style>
