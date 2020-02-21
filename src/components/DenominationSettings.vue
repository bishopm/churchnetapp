<template>
  <div class="q-ma-md">
    <p class="caption text-center">Circuit settings</p>
    <circuitselect class="q-ma-md" @altered="setcircuit" :perms="['admin']" showme="1"></circuitselect>
    <div class="q-ma-md">
      <q-input outlined hide-bottom-space error-message="The circuit field is required" label="Circuit name" v-model="form.circuit" :rules="[ val => val.length >= 1 ]" />
    </div>
    <div class="q-ma-md">
      <q-input outlined hide-bottom-space error-message="The circuit number is required" label="Circuit number" v-model="form.circuitnumber" :rules="[ val => val >= 1 ]" />
    </div>
    <div class="q-ma-md">
      <q-input outlined hide-bottom-space error-message="The slug is required" label="Slug" v-model="form.slug" :rules="[ val => val.length >= 1 ]" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Circuit office contact details" v-model="form.office_contact" />
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Preaching plan first month" v-model="form.plan_month" :options="[{ label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 }]" map-options emit-value/>
    </div>
    <div class="text-center">
      <q-btn class="q-mt-md" color="primary" @click="update()" label="Update" />
    </div>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
export default {
  data () {
    return {
      search: '',
      circuit: {},
      form: {
        circuit: '',
        circuitnumber: '',
        slug: '',
        plan_month: '',
        office_contact: ''
      }
    }
  },
  methods: {
    setcircuit () {
      this.circuit = this.$store.state.user.circuits.full[this.$store.state.select]
      this.form = this.circuit
    },
    update () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/circuits/' + this.$store.state.select,
          {
            circuit: this.form.circuit,
            circuitnumber: this.form.circuitnumber,
            slug: this.form.slug,
            plan_month: this.form.plan_month,
            office_contact: this.form.office_contact
          })
          .then(response => {
            this.$q.notify('Circuit updated')
            this.$router.push({ name: 'circuitsettings' })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  components: {
    'circuitselect': circuitselect
  },
  mounted () {
    this.setcircuit()
  }

}
</script>

<style>
</style>
