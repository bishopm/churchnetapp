<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a roster
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.title.$error" error-label="The roster title field is required">
        <q-input float-label="Roster title" v-model="form.title" @blur="$v.form.title.$touch()" :error="$v.form.title.$error" />
      </q-field>
    </div>
    <societyselect class="q-ma-md" :perms="['edit','admin']" showme="1"></societyselect>
    <div class="q-ma-md">
      <q-select float-label="Day of week" v-model="form.dayofweek" :options="[{ label: 'Monday', value: 'Monday' }, { label: 'Tuesday', value: 'Tuesday' }, { label: 'Wednesday', value: 'Wednesday' }, { label: 'Thursday', value: 'Thursday' }, { label: 'Friday', value: 'Friday' }, { label: 'Saturday', value: 'Saturday' }, { label: 'Sunday', value: 'Sunday' }]"/>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import societyselect from './../Societyselect'
import { format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      id: '',
      form: {
        title: '',
        dayofweek: 'Sunday'
      }
    }
  },
  validations: {
    form: {
      title: { required }
    }
  },
  components: {
    'societyselect': societyselect
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/rosters/' + this.$route.params.roster)
        .then((response) => {
          this.form = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/rosters',
            {
              name: this.form.title,
              dayofweek: this.form.dayofweek,
              society_id: this.$store.state.select
            })
            .then(response => {
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        }
      }
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
</style>
