<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} PAYMENT <small>{{society}}</small>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.paymentdate.$error" error-label="The date field is required">
        <q-datetime float-label="Payment date" format="YYYY-MM-DD" format-model="string" v-model="form.paymentdate" type="date" @blur="$v.form.paymentdate.$touch()" :error="$v.form.paymentdate.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.pgnumber.$error" error-label="The planned giving number is required">
        <q-input float-label="Giving number" v-model="form.pgnumber" @blur="checkpg" :error="$v.form.pgnumber.$error">
          <q-autocomplete :static-data="{field: 'value', list: indivOptions}" :min-characters="1"/>
        </q-input>
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.amount.$error" error-label="The amount is required and must be numeric">
        <q-input float-label="Amount" v-model="form.amount" @blur="$v.form.amount.$touch()" :error="$v.form.amount.$error" />
      </q-field>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
const existing = true
export default {
  data () {
    return {
      form: {
        paymentdate: '',
        pgnumber: '',
        amount: ''
      },
      indivOptions: [],
      allnums: [],
      society: ''
    }
  },
  validations: {
    form: {
      paymentdate: { required },
      amount: { numeric, required },
      pgnumber: { required, existing }
    }
  },
  methods: {
    checkpg () {
      if ((this.form.pgnumber) && (!this.allnums.includes(this.form.pgnumber))) {
        this.form.pgnumber = ''
        this.$q.notify('This number does not exist - please re-enter!')
      }
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'edit') {
          this.form.latitude = this.marker.position.lat().toString()
          this.form.longitude = this.marker.position.lng().toString()
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/households/' + this.form.id,
            {
              addressee: this.form.addressee,
              addr1: this.form.addr1,
              addr2: this.form.addr2,
              addr3: this.form.addr3,
              homephone: this.form.homephone,
              householdcell: this.form.householdcell,
              latitude: this.form.latitude,
              longitude: this.form.longitude
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Household updated')
              this.$router.push({ name: 'household', params: { id: response.data.id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          if (this.$route.params.scope === 'circuit') {
            this.soc = this.society.id
          } else {
            this.soc = this.$store.state.select
          }
          this.$axios.post(process.env.API + '/households',
            {
              addressee: this.form.addressee,
              addr1: this.form.addr1,
              addr2: this.form.addr2,
              addr3: this.form.addr3,
              homephone: this.form.homephone,
              householdcell: this.form.householdcell,
              society_id: this.soc,
              latitude: this.form.latitude,
              longitude: this.form.longitude
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Household added')
              this.$router.push({ name: 'household', params: { id: response.data.id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    }
  },
  mounted () {
    if (this.$route.params.action === 'add') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/givers/' + this.$route.params.society)
        .then((response) => {
          this.society = response.data.society
          for (var ikey in response.data.givers) {
            var newitem = {
              label: response.data.givers[ikey],
              value: response.data.givers[ikey]
            }
            this.indivOptions.push(newitem)
            this.allnums.push(response.data.givers[ikey])
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
