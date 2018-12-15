<template>
  <div class="layout-padding">
    <p class="caption text-center">Circuit settings</p>
    <circuitselect class="q-ma-md" @altered="setcircuit" :perms="['edit','admin']" showme="1"></circuitselect>
    <div class="q-mx-md">
      <q-field :error="$v.form.circuit.$error" error-label="The circuit field is required">
        <q-input float-label="Circuit name" v-model="form.circuit" @blur="$v.form.circuit.$touch()" :error="$v.form.circuit.$error" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-field :error="$v.form.circuitnumber.$error" error-label="Circuit number field is required and must be numeric">
        <q-input float-label="Circuit number" v-model="form.circuitnumber" @blur="$v.form.circuitnumber.$touch()" :error="$v.form.circuitnumber.$error" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-field :error="$v.form.slug.$error" error-label="The slug field is required">
        <q-input float-label="Slug" v-model="form.slug" @blur="$v.form.slug.$touch()" :error="$v.form.slug.$error" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-field>
        <q-input float-label="Circuit office contact details" v-model="form.office_contact" />
      </q-field>
    </div>
    <div class="q-mx-md">
      <q-select float-label="Preaching plan first month" v-model="form.plan_month" :options="[{ label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 }]"/>
    </div>
    <div class="text-center">
      <q-btn class="q-mt-md" color="primary" @click="update()" label="Update" />
    </div>
  </div>
</template>

<script>
import circuitselect from './Circuitselect'
import { required, numeric } from 'vuelidate/lib/validators'
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
  validations: {
    form: {
      circuit: { required },
      circuitnumber: { required, numeric },
      slug: { required }
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
