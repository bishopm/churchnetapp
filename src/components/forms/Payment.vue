<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} PAYMENT <small>{{society}}</small>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.paymentdate.$error" error-label="The date field is required">
        <q-datetime label="Payment date" format="YYYY-MM-DD" format-model="string" v-model="form.paymentdate" type="date" @blur="$v.form.paymentdate.$touch()" :error="$v.form.paymentdate.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.pgnumber.$error" error-label="The planned giving number is required">
        <q-input label="Giving number" v-model="form.pgnumber" @blur="checkpg" :error="$v.form.pgnumber.$error">
          <q-autocomplete :static-data="{field: 'value', list: indivOptions}" :min-characters="1"/>
        </q-input>
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.amount.$error" error-label="The amount is required and must be numeric">
        <q-input label="Amount" v-model="form.amount" @blur="$v.form.amount.$touch()" :error="$v.form.amount.$error" />
      </q-field>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn v-if="$route.params.action === 'edit'" class="q-ml-md" color="black" @click="deletePayment">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, decimal } from 'vuelidate/lib/validators'
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
      amount: { decimal, required },
      pgnumber: { required, existing }
    }
  },
  methods: {
    deletePayment () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.delete(process.env.API + '/payments/' + this.form.id)
        .then(response => {
          this.$q.notify('Payment deleted')
          this.$router.push({ name: 'giving' })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
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
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/payments/' + this.form.id + '/update',
            {
              amount: this.form.amount,
              paymentdate: this.form.paymentdate,
              pgnumber: this.form.pgnumber
            })
            .then(response => {
              this.$q.notify('Payment updated')
              this.$router.push({ name: 'giving' })
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/payments',
            {
              society_id: this.$store.state.select,
              amount: this.form.amount,
              paymentdate: this.form.paymentdate,
              pgnumber: this.form.pgnumber
            })
            .then(response => {
              this.$q.notify('Payment added')
              this.$router.push({ name: 'giving' })
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/payments/' + this.$route.params.id)
        .then((response) => {
          this.form = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
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
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
