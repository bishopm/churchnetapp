<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All payments</p>
      <societyselect class="q-mx-md" @altered="searchdb" :perms="['edit','admin']" :showme="1" initial="all"></societyselect>
      <q-item v-if="payments" v-for="payment in payments" :key="payment.id">
        <q-item-main>{{payment.paymentdate}}<span class="q-ml-lg">{{payment.pgnumber}}</span></q-item-main>
        <q-item-side>{{payment.amount}}</q-item-side>
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addPayment" class="fixed" icon="add" style="right: 18px; top: 58px" />
  </div>
</template>

<script>
import societyselect from './Societyselect'
export default {
  data () {
    return {
      payments: []
    }
  },
  components: {
    'societyselect': societyselect
  },
  methods: {
    addPayment () {
      this.$router.push({name: 'givingform', params: { action: 'add', society: this.$store.state.select }})
    },
    searchdb () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/payments/' + this.$store.state.select)
        .then(response => {
          this.payments = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
  }

}
</script>

<style>
</style>
