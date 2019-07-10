<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} PAYMENT <small>{{society}}</small>
    </div>
    <div class="q-ma-md">
      <q-input label="Payment date" outlined v-model="form.paymentdate" mask="####-##-##">
        <template v-slot:append>
          <q-icon name="fa fa-calendar" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date mask="YYYY-MM-DD" v-model="form.paymentdate" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-ma-md">
      <q-select v-model="form.pgnumber" use-input outlined hide-selected fill-input input-debounce="0" :options="filteredOptions" @filter="filterFn">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="q-ma-md">
      <q-input class="q-my-sm" label="Amount" outlined hide-bottom-space error-message="The amount is required and must be numeric" v-model="form.amount" :rules="[val => val !== null && val !== '', val => val > 0 && val < 100000000]"/>
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
      filteredOptions: [],
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
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filteredOptions = this.indivOptions
        } else {
          this.filteredOptions = []
          for (var fndx in this.indivOptions) {
            if (this.indivOptions[fndx].label.toLowerCase().includes(val.toLowerCase())) {
              this.filteredOptions.push(this.indivOptions[fndx])
            }
          }
        }
      })
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
              pgnumber: this.form.pgnumber.value
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
              pgnumber: this.form.pgnumber.value
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
